package org.cmdbuild.webapp.filters;

import static com.google.common.base.Preconditions.checkArgument;
import java.io.IOException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.io.FilenameUtils;
import org.cmdbuild.uicomponents.custompage.CustomPageService;
import static org.cmdbuild.utils.io.CmIoUtils.TIKA;
import static org.cmdbuild.utils.lang.CmExceptionUtils.runtime;
import static org.cmdbuild.utils.lang.CmPreconditions.checkNotBlank;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CustomPageFilter implements Filter {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private CustomPageService service;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        //do nothing; this init method is not invoked by spring configured filters
    }

    @Override
    public void destroy() {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        logger.debug("custom page filter doFilter BEGIN");
        String requestUrl = "<undefined>";
        try {

            requestUrl = ((HttpServletRequest) request).getRequestURI()
                    .replaceFirst(Pattern.quote(((HttpServletRequest) request).getContextPath()) + "/ui/app/view/custompages/?", "");

            logger.debug("custom page filter filter, processing request = {}", requestUrl);

            Matcher matcher = Pattern.compile("([^/]+)/(.+)").matcher(requestUrl);
            checkArgument(matcher.matches(), "invalid custom page request path");

            String customPageName = checkNotBlank(matcher.group(1)),
                    filePath = checkNotBlank(matcher.group(2));

            byte[] responseData = service.getCustomPageFile(customPageName, filePath);

            ((HttpServletResponse) response).setHeader("CMDBuild-ProcessedByCustomPageFilter", Boolean.TRUE.toString());
            response.setContentType(TIKA.detect(responseData, FilenameUtils.getName(filePath)));
            response.setContentLength(responseData.length);
            response.getOutputStream().write(responseData);

            logger.debug("custom page filter doFilter END");
        } catch (Exception ex) {
            logger.error("error in custom page filter", ex);
            throw runtime(ex, "error processing custom page filter, request path =< %s >", requestUrl);
        }
    }

}
