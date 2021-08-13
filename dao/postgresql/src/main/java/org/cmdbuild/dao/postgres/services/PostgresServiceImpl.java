package org.cmdbuild.dao.postgres.services;

import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;
import com.google.common.eventbus.EventBus;
import static java.lang.String.format;
import static java.util.Collections.emptyList;
import java.util.List;
import javax.annotation.Nullable;
import org.cmdbuild.dao.DaoException;

import org.springframework.jdbc.core.JdbcTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.cmdbuild.dao.driver.repository.AttributeGroupRepository;
import org.cmdbuild.dao.driver.repository.AttributeRepository;
import org.cmdbuild.dao.driver.repository.ClasseRepository;
import org.cmdbuild.dao.driver.repository.DomainRepository;
import org.cmdbuild.dao.entrytype.Classe;
import org.cmdbuild.dao.entrytype.Attribute;
import org.cmdbuild.event.AfterCardCreateEvent;
import org.cmdbuild.event.AfterCardUpdateEvent;
import org.cmdbuild.event.BeforeCardDeleteEvent;
import org.cmdbuild.event.BeforeCardUpdateEvent;
import static org.cmdbuild.spring.BeanNamesAndQualifiers.SYSTEM_LEVEL_TWO;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.cmdbuild.dao.entrytype.Domain;
import org.cmdbuild.dao.entrytype.EntryType;
import org.cmdbuild.dao.entrytype.ClassDefinition;
import org.cmdbuild.dao.entrytype.DomainDefinition;
import org.cmdbuild.dao.function.StoredFunction;
import org.cmdbuild.dao.beans.Card;
import org.cmdbuild.dao.beans.CardImpl;
import org.cmdbuild.dao.driver.PostgresService;
import org.cmdbuild.dao.beans.DatabaseRecord;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.entryTypeToSqlExpr;
import static org.cmdbuild.dao.postgres.utils.SqlQueryUtils.systemToSqlExpr;
import org.cmdbuild.eventbus.EventBusService;
import static org.cmdbuild.spring.BeanNamesAndQualifiers.INNER;
import org.cmdbuild.dao.driver.repository.StoredFunctionRepository;

/**
 * postgres driver factory; will cache stuff that does not depends on tenant (ie
 * operation user) at this level, while tenant dependant stuff will be included
 * within {@link PostgresServiceImpl} instances
 *
 */
@Component
@Qualifier(SYSTEM_LEVEL_TWO)
public class PostgresServiceImpl implements PostgresService {

    protected final Logger logger = LoggerFactory.getLogger(getClass());

    private final PostgresDatabaseAdapterService databaseAdapterService;

    private final ClasseRepository classeRepository;
    private final DomainRepository domainRepository;
    private final EntryUpdateService entryUpdateService;
    private final StoredFunctionRepository functionRepository;
    private final EventBus eventBus;
    private final AttributeRepository attributeRepository;

    public PostgresServiceImpl(EntryUpdateService entryUpdateService, AttributeRepository attributeRepository, @Qualifier(INNER) StoredFunctionRepository functionRepository, ClasseRepository classeRepository, DomainRepository domainRepository, PostgresDatabaseAdapterService databaseAdapterService, AttributeGroupRepository attributeGroupRepository, EventBusService eventBusService) {
        this.databaseAdapterService = checkNotNull(databaseAdapterService);
        this.eventBus = eventBusService.getCardEventBus();
        this.domainRepository = checkNotNull(domainRepository);
        this.classeRepository = checkNotNull(classeRepository);
        this.functionRepository = checkNotNull(functionRepository);
        this.attributeRepository = checkNotNull(attributeRepository);
        this.entryUpdateService = checkNotNull(entryUpdateService);
    }

    @Override
    public JdbcTemplate getJdbcTemplate() {
        return databaseAdapterService.getJdbcTemplate();
    }

    @Override
    public Classe getClasseOrNull(long id) {
        return classeRepository.getClasseOrNull(id);
    }

    @Override
    public Domain getDomainOrNull(Long id) {
        return domainRepository.getDomainOrNull(id);
    }

    @Override
    @Nullable
    public Domain getDomainOrNull(@Nullable String localname) {
        return domainRepository.getDomainOrNull(localname);
    }

    @Override
    public List<StoredFunction> getAllFunctions() {
        return functionRepository.getAllFunctions();
    }

    @Override
    @Nullable
    public StoredFunction getFunctionOrNull(@Nullable String name) {
        return functionRepository.getFunctionOrNull(name);
    }

    @Override
    public List<Classe> getAllClasses() {
        return classeRepository.getAllClasses();
    }

    @Override
    public Classe getClasseOrNull(String localname) {
        return classeRepository.getClasseOrNull(localname);
    }

    @Override
    public Classe createClass(ClassDefinition definition) {
        return classeRepository.createClass(definition);
    }

    @Override
    public Classe updateClass(ClassDefinition definition) {
        return classeRepository.updateClass(definition);
    }

    @Override
    public void deleteClass(Classe classe) {
        classeRepository.deleteClass(classe);
    }

    @Override
    public Attribute createAttribute(Attribute definition) {
        return attributeRepository.createAttribute(definition);
    }

    @Override
    public List<Attribute> updateAttributes(List<Attribute> definitions) {
        return attributeRepository.updateAttributes(definitions);
    }

    @Override
    public void deleteAttribute(Attribute attribute) {
        attributeRepository.deleteAttribute(attribute);
    }

    @Override
    public List<Domain> getAllDomains() {
        return domainRepository.getAllDomains();
    }

    @Override
    public Domain createDomain(DomainDefinition definition) {
        return domainRepository.createDomain(definition);
    }

    @Override
    public Domain updateDomain(DomainDefinition definition) {
        return domainRepository.updateDomain(definition);
    }

    @Override
    public void deleteDomain(Domain dbDomain) {
        domainRepository.deleteDomain(dbDomain);
    }

    @Override
    public List<Domain> getDomainsForClasse(Classe classe) {
        return domainRepository.getDomainsForClasse(classe);
    }

    @Override
    public Long create(DatabaseRecord entry) {
        logger.debug("create entry for type = {}", entry.getType());
        long id = entryUpdateService.executeInsertAndReturnKey(entry);
        postCreate(entry, id);
        return id;
    }

    @Override
    public List<Long> createBatch(List<DatabaseRecord> records) { //TODO improve this, real batch
        if (records.isEmpty()) {
            return emptyList();
        } else {
            checkArgument(records.stream().map(DatabaseRecord::getType).distinct().count() == 1, "all records in a batch must be of the same type");
            EntryType type = records.get(0).getType();
            logger.debug("create {} batch entries for type = {}", records.size(), type);
            List<Long> keys = entryUpdateService.executeBatchInsertAndReturnKeys(records);
            for (int i = 0; i < records.size(); i++) {
                postCreate(records.get(i), keys.get(i));
            }
            return keys;
        }
    }

    private void postCreate(DatabaseRecord entry, long id) {
        logger.debug("created entry for type = {} id = {}", entry.getType(), id);
        if (entry instanceof Card) {
            eventBus.post((AfterCardCreateEvent) () -> CardImpl.copyOf((Card)entry).withId(id).build()); //NOTA: card non ricaricata !
        }
    }

    @Override
    public void update(DatabaseRecord entry) {
        logger.debug("updating entry with type = {} id = {}", entry.getType(), entry.getId());
        if (entry instanceof Card) {
            eventBus.post(new BeforeCardUpdateEvent() {
                @Override
                public Card getNextCard() {
                    return (Card) entry;//TODO
                }

                @Override
                public Card getCurrentCard() {
                    return (Card) entry;
                }
            });
        }
        entryUpdateService.executeUpdate(entry);
        if (entry instanceof Card) {
            eventBus.post(new AfterCardUpdateEvent() {
                @Override
                public Card getPreviousCard() {
                    return (Card) entry;//TODO
                }

                @Override
                public Card getCurrentCard() {
                    return (Card) entry;//TODO
                }
            });
        }
    }

    @Override
    public void delete(DatabaseRecord record) {
        try {
            logger.debug("deleting record with id = {} for type = {}", record.getId(), record.getType());
            if (record instanceof Card) {
                eventBus.post((BeforeCardDeleteEvent) () -> (Card) record);
            }
            databaseAdapterService.getJdbcTemplate().queryForObject(format("SELECT _cm3_card_delete(%s,%s)", systemToSqlExpr(record.getType()), checkNotNull(record.getId(), "unable to delete entry = %s, missing entry id", record)), Object.class);
        } catch (Exception ex) {
            throw new DaoException(ex, "error deleting record = %s", record);
        }
    }

    @Override
    public void truncate(EntryType type) {
        logger.info("clearing type = {}", type);
        // truncate all subclasses as well
        databaseAdapterService.getJdbcTemplate().execute(format("TRUNCATE TABLE %s CASCADE", entryTypeToSqlExpr(type)));
    }

}
