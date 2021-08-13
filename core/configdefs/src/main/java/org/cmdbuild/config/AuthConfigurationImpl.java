package org.cmdbuild.config;

import static com.google.common.base.Preconditions.checkNotNull;
import java.util.Collection;
import java.util.List;
import javax.annotation.Nullable;
import static org.apache.commons.lang3.StringUtils.isBlank;
import org.cmdbuild.config.api.ConfigComponent;
import org.cmdbuild.config.api.ConfigValue;
import static org.cmdbuild.config.api.ConfigValue.FALSE;
import static org.cmdbuild.config.api.ConfigValue.TRUE;
import org.springframework.stereotype.Component;
import org.cmdbuild.auth.login.AuthenticationConfiguration;
import org.cmdbuild.auth.login.PasswordAlgo;
import org.cmdbuild.auth.login.oauth.OauthProtocol;
import static org.cmdbuild.config.api.ConfigCategory.CC_ENV;
import org.cmdbuild.utils.date.Interval;
import static org.cmdbuild.utils.lang.CmCollectionUtils.list;

@Component
@ConfigComponent("org.cmdbuild.auth")
public final class AuthConfigurationImpl implements AuthenticationConfiguration {

    @ConfigValue(key = "force.ws.password.digest", description = "", defaultValue = TRUE)
    private boolean forceWsPasswordDigest;

    @ConfigValue(key = "case.insensitive", description = "", defaultValue = FALSE)
    private boolean authCaseInsensitive;

    @ConfigValue(key = "users.expireInactiveAfterPeriod", description = "optional, if set all users that does not log in (or have an active session) for specified time period will be inactivated (active=false); value is a iso 8601 period es: `P60D` or `P6M`; note: remember to set an eventLog retention time bigger than user inactivation time")
    private String expireInactiveUsersAfterPeriod;

    @ConfigValue(key = "loginAttributeMode", description = "login attribute selection mode, one of `auto_detect_email` (use euristics to detect if login is email, in which case use `Email` attribute), `username` or `email`", defaultValue = "username")
    private UserRepoLoginAttributeMode loginAttributeMode;

    @ConfigValue(key = "methods", description = "auth methods (valid values are 'DBAuthenticator', 'LdapAuthenticator', "
            + "etc; 'rsa' and 'file' are always enabled, you can disable them by adding '-rsa' and '-file'; "
            + "order of auth methods is meaningful", defaultValue = "DBAuthenticator")
    private List<String> authMethods;

    @ConfigValue(key = "header.attribute.name", description = "", defaultValue = "username")
    private String headerAttributeName;

    @ConfigValue(key = "cas.server.url", description = "", defaultValue = "https://cas-test:9443/cas", category = CC_ENV)
    private String casServerUrl;

    @ConfigValue(key = "cas.login.page", description = "", defaultValue = "/login", category = CC_ENV)
    private String casLoginPage;

    @ConfigValue(key = "cas.ticket.param", description = "", defaultValue = "ticket", category = CC_ENV)
    private String casTicketParam;

    @ConfigValue(key = "cas.service.param", description = "", defaultValue = "service", category = CC_ENV)
    private String casServiceParam;

    @ConfigValue(key = "ldap.basedn", description = "ldap base dn for user query (such as dc=example,dc=com)", defaultValue = "", category = CC_ENV)
    private String ldapBaseDn;

    @ConfigValue(key = "ldap.server.address", description = "ldap server host address", defaultValue = "localhost", category = CC_ENV)
    private String ldapServerAddress;

    @ConfigValue(key = "ldap.server.port", description = "ldap server port", defaultValue = "389", category = CC_ENV)
    private int ldapServerPort;

    @ConfigValue(key = "ldap.server.url", description = "ldap server url (if set, will override server host, port and ssl config); you may specify multiple urls separated by one space (see java docs for ldap url param)", category = CC_ENV)
    private String ldapServerUrl;

    @ConfigValue(key = "ldap.bind.attribute", description = "ldap user bind attribute (used for searching users on ldap directory)", defaultValue = "cn", category = CC_ENV)
    private String ldapBindAttribute;

    @ConfigValue(key = "ldap.search.filter", description = "ldap search filter (used in addition to bind attribute, to further refine user query", defaultValue = "", category = CC_ENV)
    private String ldapSearchFilter;

    @ConfigValue(key = "ldap.search.auth.method", description = "ldaph auth method (optional, one of 'none', 'simple' or 'strong')", defaultValue = "simple", category = CC_ENV)
    private String ldapAuthenticationMethod;

    @ConfigValue(key = "ldap.search.auth.principal", description = "ldap auth principal, such as uid=admin,ou=system", defaultValue = "", category = CC_ENV)
    private String ldapAuthenticationPrincipal;

    @ConfigValue(key = "ldap.search.auth.password", description = "ldap auth password (or other credentials)", defaultValue = "", category = CC_ENV)
    private String ldapAuthenticationPassword;

    @ConfigValue(key = "ldap.use.ssl", description = "enable ldaps", defaultValue = FALSE, category = CC_ENV)
    private boolean ldapUseSsl;

    @ConfigValue(key = "ldap.use.tls", description = "enable StartTLS (ldap+tls protocol)", defaultValue = FALSE, category = CC_ENV)
    private boolean ldapStartTls;

    @ConfigValue(key = "ldap.followReferrals", description = "enable referrals = follow", defaultValue = FALSE, category = CC_ENV)
    private boolean followReferrals;

    @ConfigValue(key = "customlogin.enabled", description = "enable custom login (custom login request processing, to integrate with proprietary ssl/login frameworks)", defaultValue = FALSE)
    private boolean customLoginEnabled;

    @ConfigValue(key = "customlogin.handler", description = "custom login handler script (beanshell script, optionally encoded with base 64 or PACK)")
    private String customLoginHandlerScript;

    @ConfigValue(key = "customlogin.classpath", description = "custom login handler script classpath")
    private String customLoginHandlerScriptClasspath;

    @ConfigValue(key = "preferredPasswordAlgorythm", description = "preferred password algorythm, one of `legacy` (legacy algo), `cm3easy` (modern but symmetric encryption algo, AES), `cm3` (state-of-the-art, secure algo, PBKDF2)", defaultValue = "cm3")
    private PasswordAlgo preferredPasswordAlgorythm;

    @ConfigValue(key = "logoutRedirect", description = "logount redirect url (es: `http://my.sso/some/path` or `https://cas-test:9443/cas/logout?service=http%3A%2F%2Fcmdbuild%3A8080%2Fcmdbuild`); if set, after logout browser will redirect here")
    private String logoutRedirectUrl;

    @ConfigValue(key = "saml.sp.id", description = "saml service provider entityId", defaultValue = "http://localhost:8080/cmdbuild", category = CC_ENV)
    private String samlServiceProviderEntityId;

    @ConfigValue(key = "saml.sp.baseUrl", description = "saml service provider base url (es: http://localhost:8080/cmdbuild ); if not set use ui auto url", category = CC_ENV)
    private String cmdbuildBaseUrlForSaml;

    @ConfigValue(key = "saml.sp.key", description = "saml service provider private key (Format PKCS#8   BEGIN PRIVATE KEY)", defaultValue = "pack22u79pnn63q1obiz1qkp7atyvo4o9enzyayazk9jjxbtwpxnhkkcsnsyj579qykl2dp9hkzq8ke6a4wghie6irq7m3boryya1uc6fymnigfz2zzxxuar860rdlgpwamrjvmugbjayv7zo0tr1vdsj2xjwwv0eynyv46pgyyhu1jhrgguxo7t8wey4qc8x4mbnx88t7tr60dn10osyprc8g9f6p7hwx43q4mavmim9pvsn5uj263y97zn15j7nkve4g9s9t0270oczdlfyhy59ctxs0la2h9e42919pzc8vq9xy6qdrkmey7ru98a1svdqobcacsv67b91xnes4pfavvzp4tpne4y1mo90obuf5ujhturiwkw58i35jkyv4tcwna7zmtpglx8j4kqalvt90dz961m66al37iqcgc1t05mpgx6wod09situezo4xhpo0muuryglw89k8tfcm0ymj16ouzjwivhaxhqe40q88cqprpqiyxhz4xnyauebswraguk6w1nv5e8dnf1012ni3q6kxajvjnyb42poredmmy59kvqahpnyq12pxlxiph3xgxnzev8r3so88f43mojpil447hfkptjm10ti2z7w9exhesbghdtovmnu5kriu8sspzlwiuwm74zq3xraqf3hw9j1q57n6fgjq7htv9p6vmjex55wl04me7alm278vphngt7e4ekclwljygw1dxmwd1cvfnhutv9s5jv80lifjabsyfonr772lvwgitfhedztryjg9crcr2vs342ijk2tt23gfiu0u0x0bv36jd4enah4gi4vt3jccbf0r7p62raem9h1wjr7lr2bkygiznvxa14lj0dsgus9xcuj54b1vztw28a3u87xdx0649i94p1ba0n1occ388t134hnzr125qut0ol4wyi1ojqq227cg60h2ncr6mlb96hpaqnkkj2z3hr4vck4gj7ly0bymmr86a31x33pmvoiww77pl7loz76a8d5dgl2vmk5h6t3d02gcy6i40449yzgjiw6yxugfv0f5t0bilq1u6kixt915aflkcap", category = CC_ENV)
    private String samlServiceProviderKey;

    @ConfigValue(key = "saml.sp.cert", description = "saml service provider x509cert certificate", defaultValue = "packdjicnlecaukw1x0enri46dngsfeukxz67w4wesmatbbbl809aueajj47kv00uj2k12exrnykcoa3lu9taxufmsh1x8wqceqi2i0rrsbz03cr4zigg2jxdzj78o51gq7txttysj0jrbafu97lot64ot5onbvkl1kjbh5ylih3gx03hw8nxhpexnm0qyhq5sd7m15dzv688sxflla0ef9yaxnlskl0uwqlo242mfj1mfvo20uujw1wj2dg0fj98wjn9pg22waijp7px6729aql023hcgwmw5917uzna2q9jey0lfejujgp9x2le90vx5vtonfl5kf47wvyf4sws7cdc28b55v8npbqtyud2laj9msi4whqf1o2609q58b85nhoufn95du4lh7xdssowy3qp450ieuw3y9qxehcbk7hgd4ax658gwlctqn09tdr5yawr01dfapti4tjownnb0z079k6al1ppoer2isaoxwjbqgybzzc6kchi80w2xnm8xay5t8cmlb5sxoewrr6oh8b2ihz1wzfxmz5tmdqi1r68pmmjmfev0e9z73xeb2vn1hyv4ktfp6wpzv7pzodae89w3mgle1gd2plqgxezo1ijzai08f548zk7ev3mwkxlj4ern28ylfzmvkwkwaot53u5h08zhbz99xc3lbroctcy8n2612fhk6x4lmvic7ayn9vok2na1lsdzt6yieir3sw52alhxoo7givs7ethlmmcdiv7sr2w4ckhbjp2fieweyafr2p1zfm2cy35otl3q67lt6ip7qup51i1qalquacjk73q2tuhsf2cpovxwnfedpgwlclvhz67mh7ktbpw3vjmkqb61exfs3r10hlwbt079adxxz5qfu168e2j27v8h681zy24mop1stcoisngvz8lnprtolisjmpitbg3s9bgkg50fitt747o6hggmpnzkcap", category = CC_ENV)
    private String samlServiceProviderCertificate;

    @ConfigValue(key = "saml.idp.id", description = "saml identity provider entityId", defaultValue = "https://saml-idp-test:9080/idp/shibboleth", category = CC_ENV)
    private String samlIdpEntityId;

    @ConfigValue(key = "saml.idp.cert", description = "saml identity provider x509cert certificate", defaultValue = "pack18b4mriym73bjdo0ncxsenmauxpjm5pjyp9sont086aqo3v15ytehgv0ou82jjluabgdbz6edx3wltuof6dbmkv35lltprg07a0zimj2llyyid82r0bhp8jar8x3fzimi3g1fsitkp0tc87389njcxy86hrdbyzx0i8h4dw33j8ek770ngqn3c78h6dugxbvzvi35akz6n7f0b06daov13zwerneusl7j18jvtegtc7wqwnapk9iksrnsage4nwf2ennvq2kcb32ohy2lp5wxgpxfwvrhvkyayv1k5tlzhl6sajdjamshsww2k6ds75jao38ymns2gg8uvso1vy2xmf7dw0988el4x8hnpnbl2o37e9h3ypfvmmnt12x0bh0lcp4snck8podkz23qn6u19rnbfmb5fu562ibrz32pabqrq289wvx6whxlv7im2ajp5q8tztnrabs4cyke2tvmg1zbpbiqllbizqtqbb5u3g7ymbc1ct9d53nqsrlo94k9vsyah7l7e9znenrav9y33zjwsp32g7gwf3iu96t7pr3mtu5ztbu48hfrpin53jn3rmluwv2l1xpcbncbygqa4bkjxuumg9153gcr2s8ncc8ndher7wnmomg48zd9hp86r3z94uqp0zzypzy3cdiejis06br5tkqmbyi402yzvn52q2js0zq06r1qaza34vsb7yje7ridpvkf4xtnd5y05xp6eyzg6yomjkukpfcowvbaultypacfamh32tm9knlep0uja96962ynw3bwjpoj5sn976mac3n8x2gezhdvftct8r245z98e0eu9uuh1hla2hyulwfxvcnx5k470yksxb708g94pd4tc7jmosrtsy27glnwonzfwqgn03djs2r9hm04kofxpvjlcnagshjgx4owd9nu1cyygupa7pdynyc7ynvi5pw5hpj1eye7iozzfi4bj11gf35xtkmaqomg0326vu1burm24zwnv8xbjs3gswvg1f1179jhmh5yu9bcupjoi0u66qbsddarqsirrfuw2v2biovjd7osc06kc12204g418ow1eqed6asde9chycnrg2szf0zkmab5lyfigiyjll6ba3176y05l4ikz4lbwmbhs39kn9m68pr95jev74wczq8x9njd0x7f43qyqpxkz29231l129fyyq5dc721ja4sb88crfqxywtp25gilfbi7yk3j5kntbqhybt83qskhe84jmzxsgrggusl8jtd5naqpeqbwfdk3id6nvgohziate2klabud5jo38f8fbtuidwrfezjs6emcn53jlqo59fqqawe9whr6h4sx5u6c1hjjkfb2n7ehuy1krag8hfcr4z1amab0mw33oj3u1b5soxs8jxdd7b7mst9pzsdo4ely3irn78gj82vt2cgdnxgmj9iblcw31sgvirwd6pff3kujxzwqm7p10xk33cj8q4958rw4dn0nii2qxux2ttmqpbxmiywtmdj88lesy4lm6nx4t34slsxikdbfjzi0wv5gjwwc8uxgg1lqdb5613on4z0zb2cc3fs48mc22m97q65c5q4m2mamnyoo58oormhn4d2ovr3e1ygddb8o7xgcbk1h3gzh4ctqkth079uurcwnciwl6zaij9wuja2v6vupwq7adms57t5z6s1hlpvuby9c1x46xsnkcap", category = CC_ENV)
    private String samlIdpCertificate;

    @ConfigValue(key = "saml.idp.login", description = "saml identity provider login url", defaultValue = "http://saml-idp-test:9080/idp/profile/SAML2/Redirect/SSO", category = CC_ENV)
    private String samlIdpLoginUrl;

    @ConfigValue(key = "saml.idp.logout", description = "saml identity provider logout url", defaultValue = "http://saml-idp-test:9080/idp/logout_TODO", category = CC_ENV)
    private String samlIdpLogoutUrl;

    @ConfigValue(key = "saml.handlerScript", description = "saml auth response handler/mapper script", defaultValue = "login = auth.getAttribute('urn:oid:0.9.2342.19200300.100.1.1')", category = CC_ENV)
    private String samlLoginHanlderScript;

    @ConfigValue(key = "maxLoginAttempts.count", description = "max login attempts", defaultValue = "5")
    private Integer maxLoginAttempts;

    @ConfigValue(key = "maxLoginAttempts.window", description = "max login attempts window (seconds)", defaultValue = "60")
    private Integer maxLoginAttemptsWindowSeconds;

    @ConfigValue(key = "oauth.protocol", description = "oauth protocol (es: `msazureoauth2`)", category = CC_ENV)
    private OauthProtocol oauthProtocol;

    @ConfigValue(key = "oauth.resourceId", description = "oauth resource id", category = CC_ENV)
    private String oauthResourceId;

    @ConfigValue(key = "oauth.clientId", description = "oauth client id", category = CC_ENV)
    private String oauthClientId;

    @ConfigValue(key = "oauth.tenantId", description = "oauth tenant id", category = CC_ENV)
    private String oauthTenantId;

    @ConfigValue(key = "oauth.serviceUrl", description = "oauth service url", category = CC_ENV)
    private String oauthServiceUrl;

    @ConfigValue(key = "oauth.redirectUrl", description = "oauth redirect url (optional, local url accepted from oauth provider; if not set, url will be build from current request)", category = CC_ENV)
    private String oauthRedirectUrl;

    @ConfigValue(key = "oauth.logout.enabled", description = "enable slo (single log out)", defaultValue = FALSE, category = CC_ENV)
    private Boolean oauthLogoutEnabled;

    @ConfigValue(key = "oauth.logout.redirectUrl", description = "oauth logout redirect url (optional, local url accepted from oauth provider for logout redirect; if not set, url will be build from current config)", category = CC_ENV)
    private String oauthLogoutRedirectUrl;

    @ConfigValue(key = "oauth.clientSecret", description = "oauth client secret", category = CC_ENV)
    private String oauthClientSecret;

    @ConfigValue(key = "oauth.scope", description = "oauth scope", defaultValue = "openid", category = CC_ENV)
    private String oauthScope;

    @ConfigValue(key = "oauth.login.attr", description = "oauth login attr (attr in oauth response to be used to match cmdbuild users)", category = CC_ENV)
    private String oauthLoginAttr;

    @ConfigValue(key = "oauth.login.type", description = "oauth login type, for example `email` or `username`", defaultValue = "auto", category = CC_ENV)
    private String oauthLoginType;

    @Override
    @Nullable
    public Interval getExpireUnusedUsersAfterDuration() {
        return isBlank(expireInactiveUsersAfterPeriod) ? null : Interval.valueOf(expireInactiveUsersAfterPeriod);
    }

    @Override
    public boolean isOauthLogoutEnabled() {
        return oauthLogoutEnabled;
    }

    @Override
    @Nullable
    public String getOauthLogoutRedirectUrl() {
        return oauthLogoutRedirectUrl;
    }

    @Override
    public OauthProtocol getOauthProtocol() {
        return oauthProtocol;
    }

    @Override
    public String getOauthResourceId() {
        return oauthResourceId;
    }

    @Override
    public String getOauthClientId() {
        return oauthClientId;
    }

    @Override
    public String getOauthClientSecret() {
        return oauthClientSecret;
    }

    @Override
    public String getOauthTenantId() {
        return oauthTenantId;
    }

    @Override
    public String getOauthServiceUrl() {
        return oauthServiceUrl;
    }

    @Override
    public String getOauthRedirectUrl() {
        return oauthRedirectUrl;
    }

    @Override
    public String getOauthScope() {
        return oauthScope;
    }

    @Override
    public String getOauthLoginAttr() {
        return oauthLoginAttr;
    }

    @Override
    public String getOauthLoginType() {
        return oauthLoginType;
    }

//    @ConfigValue(key = "maxLoginAttempts.delay", description = "delay imposed after too many failed login (seconds)", defaultValue = "60")
//    private Integer maxLoginAttemptsWindowTimeoutSeconds;
    @Override
    @Nullable
    public Integer getMaxLoginAttempts() {
        return maxLoginAttempts;
    }

    @Override
    @Nullable
    public Integer getMaxLoginAttemptsWindowSeconds() {
        return maxLoginAttemptsWindowSeconds;
    }

//    @Override
//    @Nullable
//    public Integer getLoginAttemptsExceededTimeoutSeconds() {
//        return maxLoginAttemptsWindowTimeoutSeconds;
//    }
    @Override
    public String getSamlServiceProviderEntityId() {
        return samlServiceProviderEntityId;
    }

    @Override
    public String getCmdbuildBaseUrlForSaml() {
        return cmdbuildBaseUrlForSaml;
    }

    @Override
    public String getSamlServiceProviderKey() {
        return samlServiceProviderKey;
    }

    @Override
    public String getSamlServiceProviderCertificate() {
        return samlServiceProviderCertificate;
    }

    @Override
    public String getSamlIdpEntityId() {
        return samlIdpEntityId;
    }

    @Override
    public String getSamlIdpCertificate() {
        return samlIdpCertificate;
    }

    @Override
    public String getSamlIdpLoginUrl() {
        return samlIdpLoginUrl;
    }

    @Override
    public String getSamlIdpLogoutUrl() {
        return samlIdpLogoutUrl;
    }

    @Override
    public String getSamlLoginHanlderScript() {
        return samlLoginHanlderScript;
    }

    @Override
    @Nullable
    public String getLogoutRedirectUrl() {
        return logoutRedirectUrl;
    }

    @Override
    public boolean enableLdapFollowReferrals() {
        return followReferrals;
    }

    @Override
    public boolean isCaseInsensitive() {
        return authCaseInsensitive;
    }

    @Override
    public UserRepoLoginAttributeMode getLoginAttributeMode() {
        return loginAttributeMode;
    }

    @Override
    public String getHeaderAttributeName() {
        return headerAttributeName;
    }

    @Override
    public String getCasServerUrl() {
        return casServerUrl;
    }

    @Override
    public String getCasLoginPage() {
        return casLoginPage;
    }

    @Override
    public String getCasTicketParam() {
        return casTicketParam;
    }

    @Override
    public String getCasServiceParam() {
        return casServiceParam;
    }

    @Override
    public String getLdapServerAddress() {
        return ldapServerAddress;
    }

    @Override
    public int getLdapServerPort() {
        return ldapServerPort;
    }

    @Override
    public String getLdapServerUrl() {
        return ldapServerUrl;
    }

    @Override
    public boolean enableLdapSsl() {
        return ldapUseSsl;
    }

    @Override
    public boolean enableStartTls() {
        return ldapStartTls;
    }

    @Override
    public String getLdapBaseDN() {
        return ldapBaseDn;
    }

    @Override
    public String getLdapBindAttribute() {
        return ldapBindAttribute;
    }

    @Override
    public String getLdapSearchFilter() {
        return ldapSearchFilter;
    }

    @Override
    public String getLdapAuthenticationMethod() {
        return ldapAuthenticationMethod;
    }

    @Override
    public String getLdapPrincipal() {
        return ldapAuthenticationPrincipal;
    }

    @Override
    public String getLdapPrincipalCredentials() {
        return ldapAuthenticationPassword;
    }

    @Override
    public Collection<String> getActiveAuthenticators() {
        List<String> list = list("rsa", "file");
        authMethods.forEach(a -> {
            if (a.startsWith("-")) {
                list.remove(a.replaceFirst("^-", ""));
            } else {
                list.add(a);
            }
        });
        return list;
    }

    @Override
    public boolean isCustomLoginEnabled() {
        return customLoginEnabled;
    }

    @Override
    public String getCustomLoginHandlerScript() {
        return customLoginHandlerScript;
    }

    @Override
    @Nullable
    public String getCustomLoginHandlerScriptClasspath() {
        return customLoginHandlerScriptClasspath;
    }

    @Override
    public PasswordAlgo getPreferredPasswordAlgorythm() {
        return checkNotNull(preferredPasswordAlgorythm);
    }

}
