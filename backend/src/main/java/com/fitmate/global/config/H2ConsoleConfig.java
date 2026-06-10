package com.fitmate.global.config;

import jakarta.servlet.http.HttpServlet;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@Profile("dev")
public class H2ConsoleConfig {

    @Bean
    public ServletRegistrationBean<HttpServlet> h2ConsoleServlet() throws Exception {
        Class<?> servletClass = Class.forName("org.h2.server.web.JakartaWebServlet");
        HttpServlet servlet = (HttpServlet) servletClass.getDeclaredConstructor().newInstance();
        ServletRegistrationBean<HttpServlet> registration = new ServletRegistrationBean<>(servlet, "/h2-console/*");
        registration.addInitParameter("webAllowOthers", "");
        registration.setLoadOnStartup(1);
        return registration;
    }
}
