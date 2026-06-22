package com.fitmate.member.repository;

import com.fitmate.member.entity.Member;
import com.fitmate.member.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByUserId(String userId);

    Optional<Member> findByEmail(String email);

    Optional<Member> findByUserIdAndDeletedAtIsNull(String userId);

    Optional<Member> findByEmailAndDeletedAtIsNull(String email);

    boolean existsByUserId(String userId);

    boolean existsByEmail(String email);

    boolean existsByUserIdAndDeletedAtIsNull(String userId);

    boolean existsByEmailAndDeletedAtIsNull(String email);

    Page<Member> findByRole(Role role, Pageable pageable);

    List<Member> findByRole(Role role);

    Page<Member> findAll(Pageable pageable);

    @Query("SELECT m FROM Member m WHERE " +
            "(:keyword IS NULL OR m.userId LIKE %:keyword% OR " +
            "m.userName LIKE %:keyword% OR m.email LIKE %:keyword%)")
    Page<Member> searchMembers(@Param("keyword") String keyword, Pageable pageable);

    // 역할별 카운트
    long countByRole(Role role);

    // 탈퇴 회원 제외 카운트
    long countByDeletedAtIsNull();
}
