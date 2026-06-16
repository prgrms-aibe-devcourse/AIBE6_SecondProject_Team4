package com.fitmate.auth.oauth2;

import com.fitmate.member.entity.Member;
import com.fitmate.member.entity.Role;
import com.fitmate.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);

        String provider = userRequest.getClientRegistration().getRegistrationId(); // "kakao" 또는 "google"
        OAuth2UserInfo userInfo = getOAuth2UserInfo(provider, oAuth2User.getAttributes());

        String userId = provider + "_" + userInfo.getId();

        Member member = memberRepository.findByUserIdAndDeletedAtIsNull(userId)
                .orElseGet(() -> registerNewMember(userId, userInfo));

        String nameAttributeKey = provider.equals("google") ? "sub" : "id";

        return new DefaultOAuth2User(
                List.of(new SimpleGrantedAuthority("ROLE_" + member.getRole().name())),
                oAuth2User.getAttributes(),
                nameAttributeKey
        );
    }

    private OAuth2UserInfo getOAuth2UserInfo(String provider, Map<String, Object> attributes) {
        if ("kakao".equals(provider)) {
            return new KakaoOAuth2UserInfo(attributes);
        }
        if ("google".equals(provider)) {
            return new GoogleOAuth2UserInfo(attributes);
        }
        throw new OAuth2AuthenticationException("지원하지 않는 소셜 로그인입니다: " + provider);
    }

    private Member registerNewMember(String userId, OAuth2UserInfo userInfo) {
        Member member = Member.builder()
                .userId(userId)
                .userName(userInfo.getNickname() != null ? userInfo.getNickname() : "소셜회원")
                .nickname(userInfo.getNickname() != null ? userInfo.getNickname() : "소셜회원")
                .email(null)
                .phone("000-0000-0000") // 추후 추가 정보 입력 플로우에서 받기
                .profileImage(userInfo.getProfileImage())
                .role(Role.USER)
                .build();

        return memberRepository.save(member);
    }
}