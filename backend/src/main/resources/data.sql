-- =============================================
-- FitMate 더미 데이터
-- ddl-auto: create 환경에서 앱 실행 시 자동 적용
-- 비밀번호: 모두 'password123' BCrypt 인코딩
-- =============================================

-- =============================================
-- 회원 (members)
-- =============================================
INSERT IGNORE INTO members (user_id, user_name, password, nickname, email, role, profile_image, region, introduction, phone, created_at, updated_at)
VALUES
    ('user01', '김철수', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '철수', 'user01@fitmate.com', 'USER', NULL, '서울', '운동 초보입니다.', '010-1111-1111', NOW(), NOW()),
    ('user02', '이영희', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '영희', 'user02@fitmate.com', 'USER', NULL, '부산', '다이어트가 목표입니다.', '010-2222-2222', NOW(), NOW()),
    ('user03', '박민준', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '민준', 'user03@fitmate.com', 'USER', NULL, '인천', '근육 키우고 싶어요.', '010-3333-3333', NOW(), NOW()),
    ('trainer01', '최트레이너', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '최코치', 'trainer01@fitmate.com', 'TRAINER', NULL, '서울', '10년 경력의 PT 전문 트레이너입니다.', '010-4444-4444', NOW(), NOW()),
    ('trainer02', '정트레이너', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '정코치', 'trainer02@fitmate.com', 'TRAINER', NULL, '부산', '수영, 필라테스 전문입니다.', '010-5555-5555', NOW(), NOW()),
    ('admin01', '관리자', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '관리자', 'admin@fitmate.com', 'ADMIN', NULL, NULL, NULL, '010-0000-0000', NOW(), NOW());

-- =============================================
-- 사용자 프로필 (user_profiles)
-- =============================================
INSERT IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '헬스', '초급', '다이어트' , NOW(), NOW() FROM members WHERE user_id = 'user01';

INSERT IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '수영', '초급', '체력 향상', NOW(), NOW() FROM members WHERE user_id = 'user02';

INSERT IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '헬스', '중급', '근육 증가', NOW(), NOW() FROM members WHERE user_id = 'user03';

-- =============================================
-- 트레이너 프로필 (trainer_profiles)
-- =============================================
INSERT IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id, '헬스, 크로스핏', '1:1 PT', '초급, 중급, 고급', 80000, 10, NOW(), NOW()
FROM members WHERE user_id = 'trainer01';

INSERT IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id, '수영, 필라테스', '그룹, 1:1', '초급, 중급', 60000, 5, NOW(), NOW()
FROM members WHERE user_id = 'trainer02';

-- =============================================
-- 매칭 요청 (matching_request)
-- =============================================
INSERT IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id, '초급', '헬스', '1:1 PT', '서울', 50000, 100000, '체중 감량과 기초 체력 향상을 원합니다.', NOW(), NOW()
FROM members WHERE user_id = 'user01';

INSERT IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id, '초급', '수영', '그룹', '부산', 30000, 60000, '수영 기초부터 배우고 싶습니다.', NOW(), NOW()
FROM members WHERE user_id = 'user02';

INSERT IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id, '중급', '헬스', '1:1 PT', '인천', 60000, 120000, '근육량 증가가 목표입니다.', NOW(), NOW()
FROM members WHERE user_id = 'user03';

-- =============================================
-- 알림 (alert)
-- =============================================
INSERT IGNORE INTO alert (receiver_id, type, target_id, content, is_read, created_at, updated_at)
SELECT id, 'MATCHING', 1, '매칭 요청이 수락되었습니다.', false, NOW(), NOW()
FROM members WHERE user_id = 'user01';

INSERT IGNORE INTO alert (receiver_id, type, target_id, content, is_read, created_at, updated_at)
SELECT id, 'MATCHING', 2, '매칭 요청이 수락되었습니다.', true, NOW(), NOW()
FROM members WHERE user_id = 'user02';

INSERT IGNORE INTO alert (receiver_id, type, target_id, content, is_read, created_at, updated_at)
SELECT id, 'INQUIRY', 1, '문의하신 내용에 답변이 등록되었습니다.', false, NOW(), NOW()
FROM members WHERE user_id = 'user03';

-- =============================================
-- 문의 (inquiries)
-- =============================================
INSERT IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id, 'PAYMENT', '결제 관련 문의드립니다.', 'PT 결제 후 환불이 가능한가요?', 'PENDING', NULL, NOW(), NOW()
FROM members WHERE user_id = 'user01';

INSERT IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id, 'MATCHING', '매칭이 안 되는 것 같아요.', '매칭 요청을 했는데 연락이 없습니다.', 'RESOLVED', '담당자 확인 후 처리하였습니다. 이용에 불편을 드려 죄송합니다.', NOW(), NOW()
FROM members WHERE user_id = 'user02';

INSERT IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id, 'TRAINER', '트레이너 변경이 가능한가요?', '현재 매칭된 트레이너를 변경하고 싶습니다.', 'PENDING', NULL, NOW(), NOW()
FROM members WHERE user_id = 'user03';
