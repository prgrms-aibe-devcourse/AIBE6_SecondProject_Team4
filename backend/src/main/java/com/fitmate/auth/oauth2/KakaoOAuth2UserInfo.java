package com.fitmate.auth.oauth2;

import java.util.Map;

public class KakaoOAuth2UserInfo implements OAuth2UserInfo {

    private final Map<String, Object> attributes;

    public KakaoOAuth2UserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    @Override
    public String getId() {
        return String.valueOf(attributes.get("id"));
    }

    @Override
    @SuppressWarnings("unchecked")
    public String getNickname() {
        Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");
        if (properties == null) return null;
        return (String) properties.get("nickname");
    }

    @Override
    @SuppressWarnings("unchecked")
    public String getProfileImage() {
        Map<String, Object> properties = (Map<String, Object>) attributes.get("properties");
        if (properties == null) return null;
        return (String) properties.get("profile_image");
    }
}