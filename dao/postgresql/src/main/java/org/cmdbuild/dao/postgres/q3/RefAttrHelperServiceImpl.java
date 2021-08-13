/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.cmdbuild.dao.postgres.q3;

import static com.google.common.base.Preconditions.checkNotNull;
import org.cmdbuild.dao.driver.repository.ClasseReadonlyRepository;
import org.cmdbuild.dao.driver.repository.DomainRepository;
import org.cmdbuild.dao.entrytype.Attribute;
import org.cmdbuild.dao.entrytype.Classe;
import static org.cmdbuild.dao.entrytype.attributetype.AttributeTypeName.REFERENCE;
import org.cmdbuild.dao.entrytype.attributetype.ForeignKeyAttributeType;
import org.cmdbuild.dao.entrytype.attributetype.ReferenceAttributeType;
import static org.cmdbuild.utils.lang.CmExceptionUtils.illegalArgument;
import org.springframework.stereotype.Component;

@Component
public class RefAttrHelperServiceImpl implements RefAttrHelperService {

    private final ClasseReadonlyRepository classeRepository;
    private final DomainRepository domainRepository;

    public RefAttrHelperServiceImpl(ClasseReadonlyRepository classeRepository, DomainRepository domainRepository) {
        this.classeRepository = checkNotNull(classeRepository);
        this.domainRepository = checkNotNull(domainRepository);
    }

    @Override
    public Classe getTargetClassForAttribute(Attribute a) {
        switch (a.getType().getName()) {
            case REFERENCE:
                return domainRepository.getDomain((a.getType().as(ReferenceAttributeType.class)).getDomainName()).getReferencedClass(a);
            case FOREIGNKEY:
                return classeRepository.getClasse(a.getType().as(ForeignKeyAttributeType.class).getForeignKeyDestinationClassName());
            default:
                throw illegalArgument("invalid reference/fk attr = %s", a);
        }
    }
}
