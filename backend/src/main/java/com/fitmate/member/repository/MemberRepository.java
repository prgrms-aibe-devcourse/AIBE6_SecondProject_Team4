package com.fitmate.member.repository;

import com.fitmate.member.entity.Member;
import com.fitmate.member.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByUserId(String userId);
    Optional<Member> findByEmail(String email);

    Optional<Member> findByUserIdAndDeletedAtIsNull(String userId);

    Optional<Member> findByEmailAndDeletedAtIsNull(String email);

    boolean existsByUserId(String userId);
    boolean existsByEmail(String email);
    List<Member> findByRole(Role role);
}
