package com.fitmate.global.initData;

import com.fitmate.global.util.Ut;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Profile("prod")
@Component
public class DevInitData {

    @EventListener(ApplicationReadyEvent.class)
    public void init() {
        Ut.cmd.runAsync(
                "npx openapi-typescript http://localhost:8080/v3/api-docs -o ../frontend/src/types/api.d.ts"
        );
    }
}
