(function() {
    Ext.define('CMDBuildUI.locales.pt_BR.Locales', {
        "requires": ["CMDBuildUI.locales.pt_BR.LocalesAdministration"],
        "override": "CMDBuildUI.locales.Locales",
        "singleton": true,
        "localization": "pt_BR",
        "administration": CMDBuildUI.locales.pt_BR.LocalesAdministration.administration,
        "attachments": {
            "add": "Adicionar anexo",
            "attachmenthistory": "Histórico de anexos",
            "author": "Autor",
            "browse": "Procurar &hellip;",
            "category": "Categoria",
            "code": "Código",
            "creationdate": "Data de criação",
            "deleteattachment": "Apagar Anexo",
            "deleteattachment_confirmation": "Tem certeza que deseja apagar este anexo?",
            "description": "Descrição",
            "download": "Baixar",
            "dropfiles": "Soltar arquivos aqui",
            "editattachment": "Editar anexos",
            "file": "Arquivo",
            "filealreadyinlist": "O arquivo {0} já está na lista.",
            "filename": "Nome do arquivo",
            "fileview": "<em>View attachment</em>",
            "invalidfiles": "Remover arquivos inválidos",
            "majorversion": "Versão principal",
            "modificationdate": "Data de modificação",
            "new": "Novo anexo",
            "nocategory": "Uncategorized",
            "preview": "Visualizar",
            "removefile": "Remover arquivo",
            "statuses": {
                "empty": "Arquivo vazio",
                "error": "Erro",
                "extensionNotAllowed": "Extensão de arquivo não é permitida",
                "loaded": "Carregado",
                "ready": "Pronto"
            },
            "successupload": "{0} anexos carregados.",
            "uploadfile": "Transferir arquivo",
            "version": "Versão",
            "viewhistory": "Exibir histórico de anexos",
            "warningmessages": {
                "atleast": "Atenção: foi carregado {0} anexos do tipo \"{1}\". Esta categoria espera pelo menos {2} anexos ",
                "exactlynumber": "Atenção: foi carregado {0} anexos do tipo \"{1}\". Esta categoria espera {2} anexos",
                "maxnumber": "Aviso: foi carregado {0} anexo do tipo \"{1}\". Esta categoria espera no máximo {2} anexos"
            },
            "wrongfileextension": "{0} extensão de arquivo não é permitida"
        },
        "bim": {
            "bimViewer": "Visualizador BIM",
            "card": {
                "label": "Cartão"
            },
            "layers": {
                "label": "Camadas",
                "menu": {
                    "hideAll": "Esconder tudo",
                    "showAll": "Exibir tudo"
                },
                "name": "Nome",
                "qt": "Qt",
                "visibility": "Visibilidade"
            },
            "menu": {
                "camera": "Câmara",
                "frontView": "Visualização Frontal",
                "mod": "Controlos de visualização",
                "orthographic": "Câmera ortográfica",
                "pan": "Rolagem",
                "perspective": "Câmera de perspectiva",
                "resetView": "Reiniciar visualização",
                "rotate": "Rotacionar",
                "sideView": "Visualização lateral",
                "topView": "Visualização de cima"
            },
            "showBimCard": "Abrir visualizador 3D",
            "tree": {
                "arrowTooltip": "Selecionar elemento",
                "columnLabel": "Árvore",
                "label": "Árvore",
                "open_card": "Abrir cartão relacionado",
                "root": "Raiz Ifc"
            }
        },
        "bulkactions": {
            "abort": "Abortar itens selecionados",
            "cancelselection": "Cancelar a seleção",
            "confirmabort": "Você está abortando {0} casos de processo. Tem certeza que quer prosseguir?",
            "confirmdelete": "Você está excluindo {0} cartas. Tem certeza que quer prosseguir?",
            "confirmdeleteattachements": "Você está excluindo {0} anexos. Tem certeza que quer prosseguir?",
            "confirmedit": "Você está modificando {0} para cartões {1}. Tem certeza que quer prosseguir?",
            "delete": "Excluir itens selecionados",
            "download": "Baixe anexos selecionados",
            "edit": "Editar itens selecionados",
            "selectall": "Selecione todos os itens"
        },
        "calendar": {
            "active_expired": "Ativo/Expirado",
            "add": "Adicionar cronograma",
            "advancenotification": "Notificação antecipada de dias",
            "allcategories": "Todas as categorias",
            "alldates": "Todas as datas",
            "calculated": "Calculado",
            "calendar": "Calendário",
            "cancel": "Marca como cancelada",
            "category": "Categoria",
            "cm_confirmcancel": "Tem certeza que deseja marcar como horários selecionados cancelados?",
            "cm_confirmcomplete": "Tem certeza que deseja marcar como horários selecionados?",
            "cm_markcancelled": "Marque como horários selecionados cancelados",
            "cm_markcomplete": "Marque como cronogramas selecionados completos",
            "complete": "Marque como feito",
            "completed": "Concluído",
            "date": "Data",
            "days": "Dias",
            "delaybeforedeadline": "Atraso antes do prazo final",
            "delaybeforedeadlinevalue": "Atraso antes do valor do prazo",
            "description": "Descrição",
            "editevent": "Editar cronograma",
            "enddate": "Data de término",
            "endtype": "Tipo final",
            "event": "Agenda",
            "executiondate": "Data da execução",
            "frequency": "Freqüência",
            "frequencymultiplier": "Multiplicador de frequência",
            "grid": "Grade",
            "leftdays": "Dias para ir",
            "londdescription": "Descrição completa",
            "manual": "Manual",
            "maxactiveevents": "Horários ativos máximos",
            "messagebodydelete": "Gostaria de remover a regra dos agendadores?",
            "messagebodyplural": "Existem regras de horário {0}",
            "messagebodyrecalculate": " Gostaria de recalcular a regra dos horários com a nova data?",
            "messagebodysingular": "Há {0} regra do cronograma",
            "messagetitle": "Cronograma recalculado",
            "missingdays": "Dias perdidos",
            "next30days": "Nos próximos 30 dias",
            "next7days": "Próximos 7 dias",
            "notificationtemplate": "Modelo usado para notificação",
            "notificationtext": "Texto de notificação",
            "occurencies": "Número de ocorrências",
            "operation": "Operação",
            "partecipantgroup": "Grupo partecipante",
            "partecipantuser": "Usuário partecipante",
            "priority": "Prioridade",
            "recalculate": "Recalcular",
            "referent": "Referente",
            "scheduler": "Agendador",
            "sequencepaneltitle": "Gerar horários",
            "startdate": "Data de início",
            "status": "Status",
            "today": "Hoje",
            "type": "Tipo",
            "viewevent": "Ver programação",
            "widgetcriterion": "Critério de cálculo",
            "widgetemails": "E-mails",
            "widgetsourcecard": "Cartão de origem"
        },
        "classes": {
            "cards": {
                "addcard": "Adicionar cartão",
                "clone": "Clonar",
                "clonewithrelations": "Clonar cartão e relações",
                "deletebeaware": "Esteja ciente de que:",
                "deleteblocked": "Não é possível prosseguir com a supressão porque há relações com {0}.",
                "deletecard": "Apagar cartão",
                "deleteconfirmation": "Tem certeza que deseja apagar este cartão?",
                "deleterelatedcards": "também {0} cartões relacionados serão excluídos",
                "deleterelations": "relações com {0} cartões serão excluídos",
                "label": "Cartões",
                "modifycard": "Editar cartão",
                "opencard": "Abrir cartão",
                "print": "Imprimir cartão"
            },
            "simple": "Simples",
            "standard": "Standard"
        },
        "common": {
            "actions": {
                "add": "Adicionar",
                "apply": "Aplicar",
                "cancel": "Cancelar",
                "close": "Fechar",
                "delete": "Apagar",
                "edit": "Editar",
                "execute": "Executar",
                "help": "Ajuda",
                "load": "Carga",
                "open": "Aberto",
                "refresh": "Atualizar dados",
                "remove": "Apagar",
                "save": "Salvar",
                "saveandapply": "Salvar e aplicar",
                "saveandclose": "Salvar e fechar",
                "search": "Pesquisar",
                "searchtext": "Pesquisar…."
            },
            "attributes": {
                "nogroup": "Dados base"
            },
            "dates": {
                "date": "dd/mm/yyyy",
                "datetime": "d/m/Y H:i:s",
                "time": "H:i:s"
            },
            "editor": {
                "clearhtml": "Limpar HTML",
                "expand": "Expandir editor",
                "reduce": "Reduzir editor",
                "unlink": "<em>Unlink</em>",
                "unlinkmessage": "<em>Transform the selected hyperlink into text.</em>"
            },
            "grid": {
                "disablemultiselection": "Desativar seleção múltipla",
                "enamblemultiselection": "Ativar seleção múltipla",
                "export": "Exportar dados",
                "filterremoved": "O filtro atual foi removido",
                "import": "Importar dados",
                "itemnotfound": "Item não localizado",
                "list": "Lista",
                "opencontextualmenu": "Abrir menu de contexto",
                "print": "Imprimir",
                "printcsv": "Imprimir como CSV",
                "printodt": "Imprimir como ODT",
                "printpdf": "Imprimir como PDF",
                "row": "Item",
                "rows": "Itens",
                "subtype": "Sub Tipo"
            },
            "tabs": {
                "activity": "Atividade",
                "attachment": "Anexo",
                "attachments": "Anexos",
                "card": "Cartão",
                "clonerelationmode": "Modo de Relações com Clones",
                "details": "Detalhes",
                "emails": "Emails",
                "history": "Histórico",
                "notes": "Anotações",
                "relations": "Relações",
                "schedules": "Horários"
            }
        },
        "dashboards": {
            "tools": {
                "gridhide": "Ocultar grade de dados",
                "gridshow": "Mostrar grade de dados",
                "parametershide": "Ocultar parâmetros de dados",
                "parametersshow": "Mostrar parâmetros de dados",
                "reload": "Recarregar"
            }
        },
        "emails": {
            "addattachmentsfromdocumentarchive": "Adicionar anexos do arquivo de documentos",
            "alredyexistfile": "Já existe um arquivo com este nome",
            "archivingdate": "Data de arquivo",
            "attachfile": "Anexar arquivo",
            "bcc": "Bcc",
            "cc": "Cc",
            "composeemail": "Escrever email",
            "composefromtemplate": "Escrever a partir de um modelo",
            "delay": "Atraso",
            "delays": {
                "day1": "Em 1 dia",
                "days2": "Em 2 dias",
                "days4": "Em 4 dias",
                "hour1": "1 hora",
                "hours2": "2 horas",
                "hours4": "4 horas",
                "month1": "Em 1 mês",
                "negativeday1": "1 dia antes",
                "negativedays2": "2 dias antes",
                "negativedays4": "4 dias antes",
                "negativehour1": "1 hora antes",
                "negativehours2": "2 horas antes",
                "negativehours4": "4 horas antes",
                "negativemonth1": "1 mês antes",
                "negativeweek1": "1 semana antes",
                "negativeweeks2": "2 semanas antes",
                "none": "Nenhum",
                "week1": "Em 1 semana",
                "weeks2": "Em 2 semanas"
            },
            "dmspaneltitle": "Selecionar anexos via banco de dados",
            "edit": "Editar",
            "from": "De",
            "gridrefresh": "Atualizar grade",
            "keepsynchronization": "Manter sincronizado",
            "message": "Mensagem",
            "regenerateallemails": "Recriar todos os emails",
            "regenerateemail": "Recriar email",
            "remove": "Apagar",
            "remove_confirmation": "Tem certeza que deseja apagar este email?",
            "reply": "Responder",
            "replyprefix": "Em {0}, {1} escreveu:",
            "selectaclass": "Selecione uma classe",
            "sendemail": "Enviar email",
            "statuses": {
                "draft": "Rascunho",
                "error": "Erro",
                "outgoing": "Enviando",
                "received": "Recebido",
                "sent": "Enviado"
            },
            "subject": "Assunto",
            "to": "Para",
            "view": "Exibir"
        },
        "errors": {
            "autherror": "Usuário ou senha incorretos",
            "classnotfound": "Classe {0} não encontrada",
            "fieldrequired": "Este campo é necessário",
            "invalidfilter": "Filtro inválido",
            "notfound": "Item não encontrado"
        },
        "filters": {
            "actions": "Ações",
            "addfilter": "Adicionar filtro",
            "any": "Qualquer",
            "attachments": "<em>Attachments</em>",
            "attachmentssearchtext": "<em>Attachments search text</em>",
            "attribute": "Escolher um atributo",
            "attributes": "Atributos",
            "clearfilter": "Limpar filtro",
            "clone": "Clonar",
            "copyof": "Cópia de",
            "currentgroup": "Grupo atual",
            "currentuser": "Usuário atual",
            "defaultset": "Definido como padrão",
            "defaultunset": "Desafinido do padrão",
            "description": "Descrição",
            "domain": "Domínio",
            "filterdata": "Filtrar data",
            "fromfilter": "<em>From filter</em>",
            "fromselection": "A partir da seleção",
            "group": "Grupo",
            "ignore": "Ignorar",
            "migrate": "Migrar",
            "name": "Nome",
            "newfilter": "Novo filtro",
            "noone": "Ninguém",
            "operator": "Operador",
            "operators": {
                "beginswith": "Inicia em",
                "between": "Entre",
                "contained": "Incluído",
                "containedorequal": "Incluído ou igual",
                "contains": "Contêm",
                "containsorequal": "Contêm ou igual",
                "descriptionbegin": "<em>Description begins with</em>",
                "descriptioncontains": "Descrição contém",
                "descriptionends": "<em>Description ends with</em>",
                "descriptionnotbegin": "<em>Description does not begins with</em>",
                "descriptionnotcontain": "<em>Description does not contain</em>",
                "descriptionnotends": "<em>Description does not ends with</em>",
                "different": "Diferente",
                "doesnotbeginwith": "Não começa em",
                "doesnotcontain": "Não inclúi",
                "doesnotendwith": "Não termina em",
                "endswith": "Termina em",
                "equals": "Igual",
                "greaterthan": "Maior que",
                "isnotnull": "Não é nulo",
                "isnull": "É nulo",
                "lessthan": "Menor que"
            },
            "relations": "Relações",
            "type": "Tipo",
            "typeinput": "Parâmetro de entrada",
            "user": "Usuário",
            "value": "Valor"
        },
        "gis": {
            "card": "Cartão",
            "cardsMenu": "Menu de cartões",
            "code": "Código",
            "description": "Descrição",
            "extension": {
                "errorCall": "Erro",
                "noResults": "Sem resultados"
            },
            "externalServices": "Serviços externos",
            "geographicalAttributes": "Atributos geo",
            "geoserverLayers": "Camadas Geoserver",
            "layers": "Camadas",
            "list": "Lista",
            "longpresstitle": "Geoelements na área",
            "map": "Mapa",
            "mapServices": "Serviços de mapa",
            "position": "Posição",
            "root": "Raiz",
            "tree": "Árvore",
            "type": "Tipo",
            "view": "Vista",
            "zoom": "Ampliação"
        },
        "history": {
            "activityname": "Nome da atividade",
            "activityperformer": "Executante da atividade",
            "begindate": "Data de início",
            "enddate": "Data de fim",
            "processstatus": "Estado",
            "user": "Usuário"
        },
        "importexport": {
            "database": {
                "uri": "Banco de dados URI",
                "user": "Usuário de banco de dados"
            },
            "downloadreport": "Baixar relatório",
            "emailfailure": "Um problema ocorreu ao enviar o email",
            "emailmessage": "Relatório de importação anexado do arquivo \"{0}\" em data {1}",
            "emailsubject": "Importar relatório de dados",
            "emailsuccess": "O email foi enviado com sucesso!",
            "export": "Exportar",
            "exportalldata": "Todos os dados",
            "exportfiltereddata": "Apenas dados que correspondem ao filtro de grade",
            "gis": {
                "shapeimportdisabled": "A importação de formas não está habilitada para este modelo",
                "shapeimportenabled": "Configuração de importação de formas"
            },
            "ifc": {
                "card": "<em>Card</em>",
                "project": "Projeto",
                "sourcetype": "Importação de"
            },
            "import": "Importar",
            "importresponse": "Importar resposta",
            "response": {
                "created": "Itens criados",
                "deleted": "Itens apagados",
                "errors": "Erros",
                "linenumber": "Número da linha",
                "message": "Mensagem",
                "modified": "Itens ",
                "processed": "Linhas processadas",
                "recordnumber": "Número de registro",
                "unmodified": "Itens não modificados"
            },
            "sendreport": "Enviar relatório",
            "template": "Template",
            "templatedefinition": "Definição de modelo"
        },
        "joinviews": {
            "active": "<em>Active</em>",
            "addview": "<em>Add view</em>",
            "alias": "<em>Alias</em>",
            "attribute": "<em>Attribute</em>",
            "attributes": "<em>Attributes</em>",
            "attributesof": "<em>Attributes of: {0}</em>",
            "createview": "<em>Create view</em>",
            "datasorting": "<em>Data sortings</em>",
            "delete": "<em>Delete</em>",
            "deleteview": "<em>Delete view</em>",
            "deleteviewconfirm": "<em>Are you sure that you want to delete this view?</em>",
            "description": "<em>Description</em>",
            "disable": "<em>Disable</em>",
            "domainalias": "<em>Domain alias</em>",
            "domainsof": "<em>Domains of {0}</em>",
            "edit": "<em>Edit</em>",
            "editview": "<em>Edit view configuration</em>",
            "enable": "<em>Enable</em>",
            "fieldsets": "<em>Fieldsets</em>",
            "filters": "<em>Filters</em>",
            "generalproperties": "<em>General properties</em>",
            "group": "<em>Group</em>",
            "innerjoin": "<em>Inner join</em>",
            "jointype": "<em>Join type</em>",
            "joinview": "<em>view from join</em>",
            "klass": "<em>Class</em>",
            "manageview": "<em>Manage view</em>",
            "masterclass": "<em>Master class</em>",
            "masterclassalias": "<em>Master class alias</em>",
            "name": "<em>Name</em>",
            "newjoinview": "<em>New view from join</em>",
            "outerjoin": "<em>Outer join</em>",
            "pleaseseleceavalidmasterclass": "<em>Please select a valid master class</em>",
            "refreshafteredit": "<em>Do you want to refresh the page to see the changes?</em>",
            "selectatleastoneattribute": "<em>Please select at least one attribute to display in grid and in reduced grid on step 4.</em>",
            "showingrid": "<em>Show in grid</em>",
            "showinreducedgrid": "<em>Show in reduced grid</em>",
            "targetalias": "<em>Target class alias</em>"
        },
        "login": {
            "buttons": {
                "login": "Entrar",
                "logout": "Alterar usuário"
            },
            "fields": {
                "group": "Grupo",
                "language": "Idioma",
                "password": "Senha",
                "tenants": "Tenants",
                "username": "Usuário"
            },
            "loggedin": "Entrou",
            "title": "Entrar",
            "welcome": "Bem vindo novamente"
        },
        "main": {
            "administrationmodule": "Módulo de Administração",
            "baseconfiguration": "Configuração base",
            "cardlock": {
                "lockedmessage": "Não é possível editar este cartão pois {0} está o editando",
                "someone": "Alguém"
            },
            "changegroup": "Alterar grupo",
            "changetenant": "Alterar {0}",
            "confirmchangegroup": "Tem certeza que deseja alterar o grupo?",
            "confirmchangetenants": "Tem certeza que deseja alterar os tenants ativos?",
            "confirmdisabletenant": "Tem certeza que deseja desabilitar a flag \"ignorar tenants\"?",
            "confirmenabletenant": "Tem certeza que deseja habilitar a flag \"ignorar tenants\"?",
            "ignoretenants": "Ignorar {0}",
            "info": "Informação",
            "logo": {
                "cmdbuild": "Logotipo CMDBBuild",
                "cmdbuildready2use": "Logotipo CMDBBuild READY2USE",
                "companylogo": "Logotipo da empresa",
                "openmaint": "logotipo openMAINT"
            },
            "logout": "Sair",
            "managementmodule": "Módulo de Gerenciamento de Dados",
            "multigroup": "Multi grupo",
            "multitenant": "Multi {0}",
            "navigation": "Navegação",
            "pagenotfound": "Página não encontrada",
            "password": {
                "change": "Alterar senha",
                "confirm": "Confirmar senha",
                "email": "Endereço de e-mail",
                "err_confirm": "A senha não bate.",
                "err_diffprevious": "A senha não pode ser idêntica à anterior.",
                "err_diffusername": "A senha não pode ser idêntica ao nome de usuário.",
                "err_length": "A senha deve ter pelo menos {0} caracteres.",
                "err_reqdigit": "A senha deve conter pelo menos um dígito.",
                "err_reqlowercase": "A senha deve conter pelo menos um caractere minúsculo.",
                "err_requppercase": "A senha deve conter pelo menos um caractere maiústo.",
                "expired": "Sua senha expirou. Você deve mudá-lo agora.",
                "forgotten": "Esqueci minha senha.",
                "new": "Nova senah",
                "old": "Senha Antiga",
                "recoverysuccess": "Enviamos um e-mail com instruções para recuperar sua senha.",
                "reset": "Redefinir senha",
                "saved": "Senha corretamente salva!"
            },
            "pleasecorrecterrors": "Por favor corrija os erros indicados ",
            "preferences": {
                "comma": "Vírgula",
                "decimalserror": "O campo de decimais é necessário",
                "decimalstousandserror": "Os separadores decimais e de milhares precisam ser diferentes",
                "default": "Padrão",
                "defaultvalue": "Valor padrão",
                "firstdayofweek": "<em>First day of week</em>",
                "gridpreferencesclear": "Preferências claras de grade",
                "gridpreferencescleared": "Preferências de grade limpas!",
                "gridpreferencessave": "Salvar preferências de grade",
                "gridpreferencessaved": "Preferências de grade salvas!",
                "gridpreferencesupdate": "Atualizar preferências de grade",
                "labelcsvseparator": "Separador CSV",
                "labeldateformat": "Formato da data",
                "labeldecimalsseparator": "Separador decimal",
                "labellanguage": "Idioma",
                "labelthousandsseparator": "Separador de milhares",
                "labeltimeformat": "formato da hora",
                "msoffice": "Microsoft Office",
                "period": "Ponto",
                "preferredfilecharset": "Codificação CSV",
                "preferredofficesuite": "Ferramenta Office preferida",
                "space": "Espaço",
                "thousandserror": "O campo de milhares é necessário",
                "timezone": "Fuso horário",
                "twelvehourformat": "Formato 12 horas",
                "twentyfourhourformat": "Formato 24 horas"
            },
            "searchinallitems": "Pesquisar em todos os itens",
            "treenavcontenttitle": "{0} de {1}",
            "userpreferences": "Preferências"
        },
        "menu": {
            "allitems": "Todos os itens",
            "classes": "Classes",
            "custompages": "Páginas personalizadas",
            "dashboards": "Dashboards",
            "processes": "Processos",
            "reports": "Relatórios",
            "views": "Visualizações"
        },
        "notes": {
            "edit": "Editar anotação"
        },
        "notifier": {
            "attention": "Atenção",
            "error": "Erro",
            "genericerror": "Erro genérico",
            "genericinfo": "Informação genérica",
            "genericwarning": "Aviso genérico",
            "info": "Informação",
            "success": "Sucesso",
            "warning": "Aviso"
        },
        "patches": {
            "apply": "Aplicar patches",
            "category": "Categoria",
            "description": "Descrição",
            "name": "Nome",
            "patches": "Patches"
        },
        "processes": {
            "abortconfirmation": "Tem certeza que deseja interromper este processo?",
            "abortprocess": "Abortar processo",
            "action": {
                "advance": "Avançar",
                "label": "Ação"
            },
            "activeprocesses": "Processos ativos",
            "allstatuses": "Todos",
            "editactivity": "Editar atividade",
            "openactivity": "Abrir atividade",
            "startworkflow": "Iniciar",
            "workflow": "Fluxo de trabalho"
        },
        "relationGraph": {
            "activity": "atividade",
            "allLabelsOnGraph": "todos os rótulos em gráfico",
            "card": "Cartão",
            "cardList": "Lista de cartões",
            "cardRelations": "Relação entre Cartões",
            "choosenaviagationtree": "Alterar árvore de navegação",
            "class": "Classe",
            "classList": "Lista de Classes",
            "compoundnode": "Nó composto",
            "disable": "Desativar",
            "edges": "<em>Edges</em>",
            "enable": "Permitir",
            "labelsOnGraph": "ponta de ferramenta no gráfico",
            "level": "Nível",
            "nodes": "<em>Nodes</em>",
            "openRelationGraph": "Abrir gráfico de relacionamentos",
            "qt": "Qt",
            "refresh": "Atualizar",
            "relation": "Relação",
            "relationGraph": "Gráfico de relacionamento",
            "reopengraph": "Reabrir o gráfico deste nó"
        },
        "relations": {
            "adddetail": "Adicionar detalhe",
            "addrelations": "Adicionar relacionamentos",
            "attributes": "Atributos",
            "code": "Código",
            "deletedetail": "Apagar detalhe",
            "deleterelation": "Apagar relacionamento",
            "deleterelationconfirm": "Tem certeza que quer excluir essa relação?",
            "description": "Descrição",
            "editcard": "Editar cartão",
            "editdetail": "Editar detalhe",
            "editrelation": "Editar relacionamento",
            "extendeddata": "Dados estendidos",
            "mditems": "Itens",
            "missingattributes": "Faltam atributos obrigatórios",
            "opencard": "Abrir cartão relacionado",
            "opendetail": "Exibir detalhe",
            "type": "Tipo"
        },
        "reports": {
            "csv": "CSV",
            "download": "Baixar",
            "format": "Formato",
            "odt": "ODT",
            "pdf": "PDF",
            "print": "Imprimir",
            "reload": "Recarregar",
            "rtf": "RTF"
        },
        "system": {
            "data": {
                "lookup": {
                    "CalendarCategory": {
                        "default": {
                            "description": "Padrão"
                        }
                    },
                    "CalendarFrequency": {
                        "daily": {
                            "description": "Diária"
                        },
                        "monthly": {
                            "description": "Mensal"
                        },
                        "once": {
                            "description": "Quando"
                        },
                        "weekly": {
                            "description": "Semanal"
                        },
                        "yearly": {
                            "description": "Anual"
                        }
                    },
                    "CalendarPriority": {
                        "default": {
                            "description": "Padrão"
                        }
                    }
                }
            }
        },
        "thematism": {
            "addThematism": "Adicionar o hematismo",
            "analysisType": "Tipo de análise",
            "attribute": "Atributo",
            "calculateRules": "Gerar regras de estilo",
            "clearThematism": "Thematismo Claro",
            "color": "Cor",
            "defineLegend": "Definição de legenda",
            "defineThematism": "Definição de thematismo",
            "function": "Função",
            "generate": "Gerar",
            "geoAttribute": "Atributo geográfico",
            "graduated": "Graduado",
            "highlightSelected": "Marcar item selecionado",
            "intervals": "Intervalos",
            "legend": "legenda",
            "name": "Nome",
            "newThematism": "Novo hematismo",
            "punctual": "Pontual",
            "quantity": "Quantidade",
            "segments": "Segmentos",
            "source": "Fonte",
            "table": "Tabela",
            "thematism": "Tematismos",
            "value": "Valor"
        },
        "widgets": {
            "customform": {
                "addrow": "Adicionar linha",
                "clonerow": "Clonar linha",
                "datanotvalid": "Dados não válidos",
                "deleterow": "Apagar linha",
                "editrow": "Editar linha",
                "export": "Exportar",
                "import": "Importar",
                "importexport": {
                    "expattributes": "Dados para exportação",
                    "file": "Arquivo",
                    "filename": "Nome do arquivo",
                    "format": "Formato",
                    "importmode": "Modo de importação",
                    "keyattributes": "Principais atributos",
                    "missingkeyattr": "Por favor, escolha pelo menos um atributo-chave",
                    "modeadd": "Adicionar",
                    "modemerge": "Mesclagem",
                    "modereplace": "Substituir",
                    "separator": "Separador"
                },
                "refresh": "Atualizar para dados padrão"
            },
            "linkcards": {
                "checkedonly": "Verificado apenas",
                "editcard": "Editar cartão",
                "opencard": "Abrir cartão",
                "refreshselection": "Aplicar seleção padrão",
                "togglefilterdisabled": "Ativar filtro de grade",
                "togglefilterenabled": "Ativar filtro de grade"
            },
            "required": "Este widget é necessário."
        }
    });

    function cleardata(obj) {
        for (var key in obj) {
            if (typeof obj[key] === "string") {
                obj[key] = obj[key].replace(/^<em>(.+)<\/em>$/, "$1");
            } else if (typeof obj[key] === "object") {
                cleardata(obj[key]);
            }
        }
    }
    cleardata(CMDBuildUI.locales.Locales);
})();