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
SELECT id, '헬스', '입문/초보', '다이어트', NOW(), NOW() FROM members WHERE user_id = 'user01';

INSERT IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '수영', '입문/초보', '체형 교정', NOW(), NOW() FROM members WHERE user_id = 'user02';

INSERT IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '헬스', '중급', '근력 향상', NOW(), NOW() FROM members WHERE user_id = 'user03';

-- =============================================
-- 트레이너 프로필 (trainer_profiles)
-- =============================================
INSERT IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id, '헬스,크로스핏', 'ONE_TO_ONE', '입문/초보,중급,고급/대회준비', 80000, 10, NOW(), NOW()
FROM members WHERE user_id = 'trainer01';

INSERT IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id, '수영,필라테스', 'GROUP', '입문/초보,중급', 60000, 5, NOW(), NOW()
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
SELECT id, 'ETC', '앱 오류 문의드립니다.', '앱 사용 중 갑자기 종료되는 현상이 발생합니다.', 'PENDING', NULL, NOW() - INTERVAL 19 DAY, NOW() - INTERVAL 19 DAY FROM members WHERE user_id = 'user01';

INSERT IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id, 'MATCHING', '매칭이 안 되는 것 같아요.', '매칭 요청을 했는데 연락이 없습니다.', 'RESOLVED', '담당자 확인 후 처리하였습니다. 이용에 불편을 드려 죄송합니다.', NOW() - INTERVAL 18 DAY, NOW() - INTERVAL 18 DAY FROM members WHERE user_id = 'user02';

INSERT IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id, 'TRAINER', '트레이너 변경이 가능한가요?', '현재 매칭된 트레이너를 변경하고 싶습니다.', 'PENDING', NULL, NOW() - INTERVAL 17 DAY, NOW() - INTERVAL 17 DAY FROM members WHERE user_id = 'user03';

INSERT IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id, 'MATCHING', '매칭 취소 방법을 알고 싶어요.', '매칭을 취소하고 싶은데 어떻게 하면 되나요?', 'RESOLVED', '마이페이지 > 매칭 내역에서 취소가 가능합니다.', NOW() - INTERVAL 16 DAY, NOW() - INTERVAL 16 DAY FROM members WHERE user_id = 'user01';

INSERT IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id, 'TRAINER', '트레이너 프로필이 보이지 않아요.', '검색해도 트레이너 목록이 나타나지 않습니다.', 'PENDING', NULL, NOW() - INTERVAL 15 DAY, NOW() - INTERVAL 15 DAY FROM members WHERE user_id = 'user02';

INSERT IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id, 'ETC', '알림이 오지 않아요.', '매칭 관련 알림을 받지 못하고 있습니다.', 'RESOLVED', '알림 설정을 확인해 주세요. 문제가 지속되면 재설치를 권장합니다.', NOW() - INTERVAL 14 DAY, NOW() - INTERVAL 14 DAY FROM members WHERE user_id = 'user03';

INSERT IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id, 'TRAINER', '트레이너 리뷰 작성이 안 돼요.', '수업 완료 후 리뷰를 작성하려는데 버튼이 비활성화되어 있습니다.', 'PENDING', NULL, NOW() - INTERVAL 13 DAY, NOW() - INTERVAL 13 DAY FROM members WHERE user_id = 'user01';

INSERT IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id, 'MATCHING', '매칭 조건 수정이 가능한가요?', '이미 등록한 매칭 요청의 조건을 변경하고 싶습니다.', 'RESOLVED', '매칭 요청 수정은 마이페이지에서 가능합니다.', NOW() - INTERVAL 12 DAY, NOW() - INTERVAL 12 DAY FROM members WHERE user_id = 'user02';

INSERT IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id, 'ETC', '회원 탈퇴는 어떻게 하나요?', '서비스를 더 이상 이용하지 않으려 합니다. 탈퇴 방법을 알고 싶습니다.', 'PENDING', NULL, NOW() - INTERVAL 11 DAY, NOW() - INTERVAL 11 DAY FROM members WHERE user_id = 'user03';

INSERT IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id, 'TRAINER', '트레이너와 연락이 안 됩니다.', '매칭 후 트레이너에게 연락을 시도했는데 응답이 없습니다.', 'RESOLVED', '트레이너에게 연락을 취했습니다. 불편을 드려 죄송합니다.', NOW() - INTERVAL 10 DAY, NOW() - INTERVAL 10 DAY FROM members WHERE user_id = 'user01';

INSERT IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id, 'MATCHING', '매칭 요청이 반려되었습니다.', '매칭 요청이 반려되었는데 이유를 알 수 있을까요?', 'PENDING', NULL, NOW() - INTERVAL 9 DAY, NOW() - INTERVAL 9 DAY FROM members WHERE user_id = 'user02';

INSERT IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id, 'ETC', '프로필 사진이 업로드가 안 돼요.', '프로필 사진을 변경하려는데 업로드가 되지 않습니다.', 'RESOLVED', '지원 이미지 형식은 JPG, PNG입니다. 파일 크기는 5MB 이하여야 합니다.', NOW() - INTERVAL 8 DAY, NOW() - INTERVAL 8 DAY FROM members WHERE user_id = 'user03';

INSERT IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id, 'TRAINER', '트레이너 전문 분야를 더 추가할 수 있나요?', '트레이너 프로필에 전문 분야를 추가로 등록하고 싶습니다.', 'PENDING', NULL, NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 7 DAY FROM members WHERE user_id = 'user01';

INSERT IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id, 'MATCHING', '매칭 후 일정 조율은 어떻게 하나요?', '트레이너와 수업 일정을 어떻게 조율하면 되는지 궁금합니다.', 'RESOLVED', '매칭 완료 후 채팅 기능을 통해 트레이너와 직접 일정을 조율하실 수 있습니다.', NOW() - INTERVAL 6 DAY, NOW() - INTERVAL 6 DAY FROM members WHERE user_id = 'user02';

INSERT IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id, 'ETC', '비밀번호를 잊어버렸어요.', '로그인 시 비밀번호가 기억나지 않습니다.', 'PENDING', NULL, NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY FROM members WHERE user_id = 'user03';

INSERT IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id, 'TRAINER', '트레이너 수업 지역 변경이 가능한가요?', '현재 등록된 수업 지역을 변경하고 싶습니다.', 'RESOLVED', '트레이너 프로필 수정 페이지에서 수업 지역을 변경하실 수 있습니다.', NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 4 DAY FROM members WHERE user_id = 'user01';

INSERT IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id, 'MATCHING', '원하는 트레이너가 없어요.', '조건에 맞는 트레이너가 검색되지 않습니다.', 'PENDING', NULL, NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY FROM members WHERE user_id = 'user02';

INSERT IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id, 'ETC', '닉네임 변경이 안 됩니다.', '닉네임을 변경하려고 하는데 저장이 되지 않습니다.', 'RESOLVED', '닉네임은 특수문자를 포함할 수 없습니다. 확인 후 다시 시도해 주세요.', NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY FROM members WHERE user_id = 'user03';

INSERT IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id, 'TRAINER', '수업 후기가 삭제되었어요.', '작성한 트레이너 후기가 사라졌습니다.', 'PENDING', NULL, NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY FROM members WHERE user_id = 'user01';

INSERT IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id, 'MATCHING', '매칭 완료 후 환불이 가능한가요?', '사정이 생겨 수업을 받지 못할 것 같습니다.', 'PENDING', NULL, NOW(), NOW() FROM members WHERE user_id = 'user02';
