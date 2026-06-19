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
    ('trainer01', '최민호', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '최코치', 'trainer01@fitmate.com', 'TRAINER', NULL, '서울', '10년 경력의 PT 전문 트레이너입니다.', '010-4444-4444', NOW(), NOW()),
    ('trainer02', '정상훈', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '정코치', 'trainer02@fitmate.com', 'TRAINER', NULL, '부산', '수영, 필라테스 전문입니다.', '010-5555-5555', NOW(), NOW()),
    ('trainer03', '김태양', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '태양코치', 'trainer03@fitmate.com', 'TRAINER', NULL, '서울', '필라테스 전문 트레이너입니다.', '010-6001-0003', NOW(), NOW()),
    ('trainer04', '이준호', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '준호코치', 'trainer04@fitmate.com', 'TRAINER', NULL, '부산', '크로스핏 전문가입니다.', '010-6001-0004', NOW(), NOW()),
    ('trainer05', '박서연', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '서연코치', 'trainer05@fitmate.com', 'TRAINER', NULL, '인천', '요가 10년 경력입니다.', '010-6001-0005', NOW(), NOW()),
    ('trainer06', '최민기', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '민기코치', 'trainer06@fitmate.com', 'TRAINER', NULL, '대구', '헬스 전문 트레이너입니다.', '010-6001-0006', NOW(), NOW()),
    ('trainer07', '정하은', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '하은코치', 'trainer07@fitmate.com', 'TRAINER', NULL, '광주', '수영 국가대표 출신입니다.', '010-6001-0007', NOW(), NOW()),
    ('trainer08', '한도윤', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '도윤코치', 'trainer08@fitmate.com', 'TRAINER', NULL, '대전', '테니스 레슨 전문입니다.', '010-6001-0008', NOW(), NOW()),
    ('trainer09', '오지민', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '지민코치', 'trainer09@fitmate.com', 'TRAINER', NULL, '서울', '골프 레슨 전문가입니다.', '010-6001-0009', NOW(), NOW()),
    ('trainer10', '서윤아', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '윤아코치', 'trainer10@fitmate.com', 'TRAINER', NULL, '부산', '댄스 전문 강사입니다.', '010-6001-0010', NOW(), NOW()),
    ('trainer11', '강현우', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '현우코치', 'trainer11@fitmate.com', 'TRAINER', NULL, '인천', '헬스, 크로스핏 트레이너입니다.', '010-6001-0011', NOW(), NOW()),
    ('trainer12', '윤소희', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '소희코치', 'trainer12@fitmate.com', 'TRAINER', NULL, '서울', '필라테스, 요가 강사입니다.', '010-6001-0012', NOW(), NOW()),
    ('trainer13', '임재현', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '재현코치', 'trainer13@fitmate.com', 'TRAINER', NULL, '대구', '수영 전문 트레이너입니다.', '010-6001-0013', NOW(), NOW()),
    ('trainer14', '신예진', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '예진코치', 'trainer14@fitmate.com', 'TRAINER', NULL, '광주', '댄스, 요가 강사입니다.', '010-6001-0014', NOW(), NOW()),
    ('trainer15', '조성민', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '성민코치', 'trainer15@fitmate.com', 'TRAINER', NULL, '대전', '헬스 전문 트레이너입니다.', '010-6001-0015', NOW(), NOW()),
    ('trainer16', '권나연', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '나연코치', 'trainer16@fitmate.com', 'TRAINER', NULL, '서울', '테니스, 골프 트레이너입니다.', '010-6001-0016', NOW(), NOW()),
    ('trainer17', '문재호', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '재호코치', 'trainer17@fitmate.com', 'TRAINER', NULL, '부산', '크로스핏 전문가입니다.', '010-6001-0017', NOW(), NOW()),
    ('trainer18', '백수진', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '수진코치', 'trainer18@fitmate.com', 'TRAINER', NULL, '인천', '필라테스 전문 트레이너입니다.', '010-6001-0018', NOW(), NOW()),
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

INSERT IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id, '필라테스', 'ONE_TO_ONE', '입문/초보,중급', 70000, 4, NOW(), NOW() FROM members WHERE user_id = 'trainer03';

INSERT IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id, '크로스핏', 'GROUP', '중급,고급/대회준비', 65000, 6, NOW(), NOW() FROM members WHERE user_id = 'trainer04';

INSERT IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id, '요가', 'ONE_TO_ONE', '입문/초보,중급,고급/대회준비', 90000, 10, NOW(), NOW() FROM members WHERE user_id = 'trainer05';

INSERT IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id, '헬스', 'ONE_TO_ONE', '입문/초보', 50000, 2, NOW(), NOW() FROM members WHERE user_id = 'trainer06';

INSERT IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id, '수영', 'GROUP', '중급,고급/대회준비', 75000, 8, NOW(), NOW() FROM members WHERE user_id = 'trainer07';

INSERT IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id, '테니스', 'ONE_TO_ONE', '중급,고급/대회준비', 100000, 12, NOW(), NOW() FROM members WHERE user_id = 'trainer08';

INSERT IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id, '골프', 'ONE_TO_ONE', '입문/초보,중급', 120000, 7, NOW(), NOW() FROM members WHERE user_id = 'trainer09';

INSERT IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id, '댄스', 'GROUP', '입문/초보', 55000, 3, NOW(), NOW() FROM members WHERE user_id = 'trainer10';

INSERT IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id, '헬스,크로스핏', 'ONE_TO_ONE', '중급,고급/대회준비', 85000, 9, NOW(), NOW() FROM members WHERE user_id = 'trainer11';

INSERT IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id, '필라테스,요가', 'ONE_TO_ONE', '입문/초보,중급', 80000, 5, NOW(), NOW() FROM members WHERE user_id = 'trainer12';

INSERT IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id, '수영', 'ONE_TO_ONE', '입문/초보', 60000, 4, NOW(), NOW() FROM members WHERE user_id = 'trainer13';

INSERT IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id, '댄스,요가', 'GROUP', '중급', 58000, 5, NOW(), NOW() FROM members WHERE user_id = 'trainer14';

INSERT IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id, '헬스', 'ONLINE', '입문/초보,중급', 45000, 3, NOW(), NOW() FROM members WHERE user_id = 'trainer15';

INSERT IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id, '테니스,골프', 'ONE_TO_ONE', '고급/대회준비', 130000, 15, NOW(), NOW() FROM members WHERE user_id = 'trainer16';

INSERT IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id, '크로스핏', 'ONE_TO_ONE', '중급,고급/대회준비', 95000, 11, NOW(), NOW() FROM members WHERE user_id = 'trainer17';

INSERT IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id, '필라테스', 'GROUP', '입문/초보,중급', 67000, 6, NOW(), NOW() FROM members WHERE user_id = 'trainer18';

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

-- =============================================
-- 후기용 매칭 요청 추가
-- 후기는 matching_id UNIQUE 제약이 있어 매칭 1개당 후기 1개.
-- trainer01에게 후기를 다양하게 쌓기 위해 매칭을 추가한다.
-- lesson_content를 고유한 문구로 지정해 후기 연결 시 정확히 찾도록 함.
-- =============================================
INSERT IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id, '초급', '헬스', '1:1 PT', '서울', 50000, 100000, '[더미후기] 자세 교정 위주로 배우고 싶습니다.', NOW(), NOW()
FROM members WHERE user_id = 'user02';

INSERT IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id, '중급', '헬스', '1:1 PT', '인천', 60000, 120000, '[더미후기] 벌크업이 목표입니다.', NOW(), NOW()
FROM members WHERE user_id = 'user03';

INSERT IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id, '초급', '수영', '그룹', '부산', 30000, 60000, '[더미후기] 생존 수영을 배우고 싶어요.', NOW(), NOW()
FROM members WHERE user_id = 'user01';

INSERT IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id, '중급', '수영', '1:1', '부산', 40000, 80000, '[더미후기] 자유형 교정을 원합니다.', NOW(), NOW()
FROM members WHERE user_id = 'user03';

-- =============================================
-- 후기 (review)
-- reviewer = 작성 회원, trainer = 받는 트레이너, matching_id = 연결 매칭(UNIQUE)
-- trainer01: 5,4,5,3 / trainer02: 4,5  → 별점 분포가 다양하게 보이도록 구성
-- =============================================

-- [trainer01] user01의 기존 헬스 매칭에 대한 후기 (5점)
INSERT IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT
    (SELECT id FROM matching_request WHERE lesson_content = '체중 감량과 기초 체력 향상을 원합니다.' LIMIT 1),
    (SELECT id FROM members WHERE user_id = 'user01'),
    (SELECT id FROM members WHERE user_id = 'trainer01'),
    5, '자세를 꼼꼼하게 잡아주셔서 운동이 훨씬 수월해졌어요. 강력 추천합니다!', NOW() - INTERVAL 10 DAY, NOW() - INTERVAL 10 DAY;

-- [trainer01] user02의 추가 헬스 매칭에 대한 후기 (4점)
INSERT IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT
    (SELECT id FROM matching_request WHERE lesson_content = '[더미후기] 자세 교정 위주로 배우고 싶습니다.' LIMIT 1),
    (SELECT id FROM members WHERE user_id = 'user02'),
    (SELECT id FROM members WHERE user_id = 'trainer01'),
    4, '친절하시고 운동 효과도 좋았습니다. 다만 시간이 조금 짧게 느껴졌어요.', NOW() - INTERVAL 8 DAY, NOW() - INTERVAL 8 DAY;

-- [trainer01] user03의 추가 헬스(벌크업) 매칭에 대한 후기 (5점)
INSERT IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT
    (SELECT id FROM matching_request WHERE lesson_content = '[더미후기] 벌크업이 목표입니다.' LIMIT 1),
    (SELECT id FROM members WHERE user_id = 'user03'),
    (SELECT id FROM members WHERE user_id = 'trainer01'),
    5, '벌크업 목표에 맞춰 식단까지 챙겨주셔서 만족스럽습니다.', NOW() - INTERVAL 6 DAY, NOW() - INTERVAL 6 DAY;

-- [trainer01] user03의 기존 헬스 매칭에 대한 후기 (3점)
INSERT IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT
    (SELECT id FROM matching_request WHERE lesson_content = '근육량 증가가 목표입니다.' LIMIT 1),
    (SELECT id FROM members WHERE user_id = 'user03'),
    (SELECT id FROM members WHERE user_id = 'trainer01'),
    3, '운동은 좋았지만 예약 변경이 조금 번거로웠습니다.', NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 4 DAY;

-- [trainer02] user02의 기존 수영 매칭에 대한 후기 (4점)
INSERT IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT
    (SELECT id FROM matching_request WHERE lesson_content = '수영 기초부터 배우고 싶습니다.' LIMIT 1),
    (SELECT id FROM members WHERE user_id = 'user02'),
    (SELECT id FROM members WHERE user_id = 'trainer02'),
    4, '수영 기초를 차근차근 알려주셔서 좋았어요.', NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY;

-- [trainer02] user01의 추가 수영 매칭에 대한 후기 (5점)
INSERT IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT
    (SELECT id FROM matching_request WHERE lesson_content = '[더미후기] 생존 수영을 배우고 싶어요.' LIMIT 1),
    (SELECT id FROM members WHERE user_id = 'user01'),
    (SELECT id FROM members WHERE user_id = 'trainer02'),
    5, '겁이 많았는데 안전하게 잘 이끌어주셨습니다. 감사해요!', NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY;

-- =============================================
-- [페이지네이션 테스트용] trainer01 후기 추가
-- trainer01에게 후기를 더 쌓아 페이지가 나뉘도록 함 (size 5 기준 2페이지+)
-- 매칭은 후기 1개당 1개 필요 (matching_id UNIQUE)
-- =============================================

-- 추가 매칭 6개 (user01·user02·user03이 trainer01용으로)
INSERT IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id, '초급', '헬스', '1:1 PT', '서울', 50000, 100000, '[더미페이지] 식단 관리 병행 희망', NOW(), NOW()
FROM members WHERE user_id = 'user01';

INSERT IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id, '중급', '헬스', '1:1 PT', '부산', 50000, 100000, '[더미페이지] 체형 교정 희망', NOW(), NOW()
FROM members WHERE user_id = 'user02';

INSERT IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id, '고급', '헬스', '1:1 PT', '인천', 50000, 100000, '[더미페이지] 대회 준비', NOW(), NOW()
FROM members WHERE user_id = 'user03';

INSERT IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id, '초급', '헬스', '1:1 PT', '서울', 50000, 100000, '[더미페이지] 운동 습관 만들기', NOW(), NOW()
FROM members WHERE user_id = 'user01';

INSERT IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id, '중급', '헬스', '1:1 PT', '부산', 50000, 100000, '[더미페이지] 근지구력 향상', NOW(), NOW()
FROM members WHERE user_id = 'user02';

INSERT IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id, '초급', '헬스', '1:1 PT', '인천', 50000, 100000, '[더미페이지] 재활 운동', NOW(), NOW()
FROM members WHERE user_id = 'user03';

-- 트레이너 프로필 공개 설정 기본값 적용
UPDATE trainer_profiles SET is_public = true WHERE is_public IS NULL;

-- 추가 후기 6개 (모두 trainer01에게, 별점 다양하게)
INSERT IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[더미페이지] 식단 관리 병행 희망' LIMIT 1),
       (SELECT id FROM members WHERE user_id = 'user01'),
       (SELECT id FROM members WHERE user_id = 'trainer01'),
       5, '식단까지 같이 봐주셔서 큰 도움이 됐습니다.', NOW() - INTERVAL 20 DAY, NOW() - INTERVAL 20 DAY;

INSERT IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[더미페이지] 체형 교정 희망' LIMIT 1),
       (SELECT id FROM members WHERE user_id = 'user02'),
       (SELECT id FROM members WHERE user_id = 'trainer01'),
       4, '체형 교정 효과를 확실히 느꼈어요.', NOW() - INTERVAL 22 DAY, NOW() - INTERVAL 22 DAY;

INSERT IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[더미페이지] 대회 준비' LIMIT 1),
       (SELECT id FROM members WHERE user_id = 'user03'),
       (SELECT id FROM members WHERE user_id = 'trainer01'),
       5, '대회 준비 디테일까지 챙겨주셔서 입상했습니다!', NOW() - INTERVAL 24 DAY, NOW() - INTERVAL 24 DAY;

INSERT IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[더미페이지] 운동 습관 만들기' LIMIT 1),
       (SELECT id FROM members WHERE user_id = 'user01'),
       (SELECT id FROM members WHERE user_id = 'trainer01'),
       3, '꾸준히 다니게 도와주셨지만 시간 약속이 가끔 어긋났어요.', NOW() - INTERVAL 26 DAY, NOW() - INTERVAL 26 DAY;

INSERT IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[더미페이지] 근지구력 향상' LIMIT 1),
       (SELECT id FROM members WHERE user_id = 'user02'),
       (SELECT id FROM members WHERE user_id = 'trainer01'),
       4, '근지구력이 눈에 띄게 좋아졌습니다.', NOW() - INTERVAL 28 DAY, NOW() - INTERVAL 28 DAY;

INSERT IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[더미페이지] 재활 운동' LIMIT 1),
       (SELECT id FROM members WHERE user_id = 'user03'),
       (SELECT id FROM members WHERE user_id = 'trainer01'),
       5, '부상 부위를 조심스럽게 잘 다뤄주셨어요. 감사합니다.', NOW() - INTERVAL 30 DAY, NOW() - INTERVAL 30 DAY;

-- =============================================
-- [작성 가능한 후기 테스트용] 매칭 성사(ACCEPTED 레슨) 더미
-- 흐름: matching_request → preferred_time + available_time → matching_result → lesson_request(ACCEPTED)
-- user02 가 trainer02(정코치)와 매칭 성사 → 아직 후기 미작성 → writable 에 떠야 함
-- 기존 후기 더미와 겹치지 않게 새 매칭(lesson_content '[더미작성가능]')으로 구성
-- =============================================

-- 1) 매칭 요청 (user02)
INSERT IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id, '초급', '수영', '1:1', '부산', 40000, 80000, '[더미작성가능] 접영 배우고 싶어요', NOW(), NOW()
FROM members WHERE user_id = 'user02';

-- 2) 사용자 희망 시간 (matching_preferred_times → 위 매칭 참조)
INSERT IGNORE INTO matching_preferred_times (matching_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[더미작성가능] 접영 배우고 싶어요' LIMIT 1),
       'MONDAY', '10:00:00', '11:00:00', NOW(), NOW();

-- 3) 트레이너 가능 시간 (trainer_available_times → trainer02 프로필 참조)
INSERT IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'MONDAY', '09:00:00', '18:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer02';

-- 4) 매칭 결과 (matching_results → 위 매칭/시간/트레이너 연결)
INSERT IGNORE INTO matching_results (matching_id, preferred_time_id, trainer_available_time_id, trainer_profile_id, created_at, updated_at)
SELECT
    (SELECT id FROM matching_request WHERE lesson_content = '[더미작성가능] 접영 배우고 싶어요' LIMIT 1),
    (SELECT pt.id FROM matching_preferred_times pt
        WHERE pt.matching_id = (SELECT id FROM matching_request WHERE lesson_content = '[더미작성가능] 접영 배우고 싶어요' LIMIT 1)
        LIMIT 1),
    (SELECT at.id FROM trainer_available_times at
        JOIN trainer_profiles tp ON at.trainer_profile_id = tp.id
        JOIN members m ON tp.user_id = m.id
        WHERE m.user_id = 'trainer02' AND at.start_time = '09:00:00'
        LIMIT 1),
    (SELECT tp.id FROM trainer_profiles tp JOIN members m ON tp.user_id = m.id WHERE m.user_id = 'trainer02' LIMIT 1),
    NOW(), NOW();

-- 5) 레슨 요청 (lesson_requests → ACCEPTED = 성사!)
INSERT IGNORE INTO lesson_requests (matching_result_id, member_id, trainer_profile_id, lesson_pass_type, weekly_count, requested_date, requested_start_time, requested_end_time, message, status, created_at, updated_at)
SELECT
    (SELECT mr.id FROM matching_results mr
     WHERE mr.matching_id = (SELECT id FROM matching_request WHERE lesson_content = '[더미작성가능] 접영 배우고 싶어요' LIMIT 1)
        LIMIT 1),
    (SELECT id FROM members WHERE user_id = 'user02'),
                                (SELECT tp.id FROM trainer_profiles tp JOIN members m ON tp.user_id = m.id WHERE m.user_id = 'trainer02' LIMIT 1),
    'ONE_TIME', NULL, '2026-06-15', '10:00:00', '11:00:00', '잘 부탁드립니다!', 'ACCEPTED', NOW(), NOW();

-- =============================================
-- [인기 트레이너 보강] 신규 트레이너 후기 더미
-- 인기 트레이너는 review만 있으면 집계됨 (매칭 성사 불필요)
-- 평점을 다양하게 + 내용 15자 이상/4점 이상으로 리얼 후기에도 노출되게 구성
-- 대상: trainer15(성민코치/헬스), trainer17(재호코치/크로스핏), trainer16(나연코치/테니스,골프)
-- matching_id UNIQUE 이므로 후기 1개당 매칭 1개 (lesson_content 고유 문구)
-- =============================================

-- ── 매칭 요청 추가 (후기 연결용) ──────────────────────────
INSERT IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id, '초급', '헬스', '온라인', '대전', 30000, 60000, '[인기더미] 온라인으로 홈트 배우고 싶어요', NOW(), NOW()
FROM members WHERE user_id = 'user01';

INSERT IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id, '중급', '헬스', '온라인', '대전', 30000, 60000, '[인기더미] 식단 코칭 받고 싶습니다', NOW(), NOW()
FROM members WHERE user_id = 'user03';

INSERT IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id, '중급', '크로스핏', '1:1', '부산', 70000, 120000, '[인기더미] 체력 한계를 넘고 싶어요', NOW(), NOW()
FROM members WHERE user_id = 'user02';

INSERT IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id, '고급', '크로스핏', '1:1', '부산', 70000, 120000, '[인기더미] 와드 기록 단축이 목표입니다', NOW(), NOW()
FROM members WHERE user_id = 'user03';

INSERT IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id, '고급', '테니스', '1:1', '서울', 100000, 150000, '[인기더미] 대회 준비 레슨 원합니다', NOW(), NOW()
FROM members WHERE user_id = 'user01';

-- ── 후기 추가 ────────────────────────────────────────────
-- [trainer15 성민코치] 5점
INSERT IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[인기더미] 온라인으로 홈트 배우고 싶어요' LIMIT 1),
       (SELECT id FROM members WHERE user_id = 'user01'),
       (SELECT id FROM members WHERE user_id = 'trainer15'),
       5, '온라인인데도 자세를 꼼꼼히 봐주셔서 홈트 효과가 확실했어요.', NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY;

-- [trainer15 성민코치] 4점
INSERT IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[인기더미] 식단 코칭 받고 싶습니다' LIMIT 1),
       (SELECT id FROM members WHERE user_id = 'user03'),
       (SELECT id FROM members WHERE user_id = 'trainer15'),
       4, '식단 피드백이 꼼꼼해서 좋았습니다. 온라인이라 편했어요.', NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 7 DAY;

-- [trainer17 재호코치] 5점
INSERT IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[인기더미] 체력 한계를 넘고 싶어요' LIMIT 1),
       (SELECT id FROM members WHERE user_id = 'user02'),
       (SELECT id FROM members WHERE user_id = 'trainer17'),
       5, '강도 높은 크로스핏인데 부상 없이 안전하게 이끌어주셨습니다.', NOW() - INTERVAL 9 DAY, NOW() - INTERVAL 9 DAY;

-- [trainer17 재호코치] 5점
INSERT IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[인기더미] 와드 기록 단축이 목표입니다' LIMIT 1),
       (SELECT id FROM members WHERE user_id = 'user03'),
       (SELECT id FROM members WHERE user_id = 'trainer17'),
       5, '와드 기록이 눈에 띄게 줄었어요. 동기부여까지 최고입니다!', NOW() - INTERVAL 11 DAY, NOW() - INTERVAL 11 DAY;

-- [trainer16 나연코치] 4점
INSERT IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[인기더미] 대회 준비 레슨 원합니다' LIMIT 1),
       (SELECT id FROM members WHERE user_id = 'user01'),
       (SELECT id FROM members WHERE user_id = 'trainer16'),
       4, '대회 대비 전략을 디테일하게 잡아주셔서 큰 도움이 됐습니다.', NOW() - INTERVAL 13 DAY, NOW() - INTERVAL 13 DAY;


-- =============================================
-- [작성 가능한 후기(writable) 보강] 매칭 성사(ACCEPTED) 더미
-- 흐름: matching_request → preferred_time + available_time → matching_result → lesson_request(ACCEPTED)
-- user01 이 trainer06(민기코치/헬스)와 매칭 성사 → 아직 후기 미작성 → writable 에 떠야 함
-- user03 이 trainer11(현우코치/헬스,크로스핏)와 매칭 성사 → writable 에 떠야 함
-- =============================================

-- ───────── user01 → trainer06(민기코치) 성사 ─────────
-- 1) 매칭 요청
INSERT IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id, '초급', '헬스', '1:1', '서울', 40000, 80000, '[더미작성가능2] 기초 근력 만들고 싶어요', NOW(), NOW()
FROM members WHERE user_id = 'user01';

-- 2) 사용자 희망 시간
INSERT IGNORE INTO matching_preferred_times (matching_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[더미작성가능2] 기초 근력 만들고 싶어요' LIMIT 1),
       'TUESDAY', '14:00:00', '15:00:00', NOW(), NOW();

-- 3) 트레이너 가능 시간 (trainer06)
INSERT IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'TUESDAY', '13:00:00', '20:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer06';

-- 4) 매칭 결과
INSERT IGNORE INTO matching_results (matching_id, preferred_time_id, trainer_available_time_id, trainer_profile_id, created_at, updated_at)
SELECT
    (SELECT id FROM matching_request WHERE lesson_content = '[더미작성가능2] 기초 근력 만들고 싶어요' LIMIT 1),
    (SELECT pt.id FROM matching_preferred_times pt
        WHERE pt.matching_id = (SELECT id FROM matching_request WHERE lesson_content = '[더미작성가능2] 기초 근력 만들고 싶어요' LIMIT 1)
        LIMIT 1),
    (SELECT at.id FROM trainer_available_times at
        JOIN trainer_profiles tp ON at.trainer_profile_id = tp.id
        JOIN members m ON tp.user_id = m.id
        WHERE m.user_id = 'trainer06' AND at.start_time = '13:00:00'
        LIMIT 1),
    (SELECT tp.id FROM trainer_profiles tp JOIN members m ON tp.user_id = m.id WHERE m.user_id = 'trainer06' LIMIT 1),
    NOW(), NOW();

-- 5) 레슨 요청 (ACCEPTED = 성사)
INSERT IGNORE INTO lesson_requests (matching_result_id, member_id, trainer_profile_id, lesson_pass_type, weekly_count, requested_date, requested_start_time, requested_end_time, message, status, created_at, updated_at)
SELECT
    (SELECT mr.id FROM matching_results mr
     WHERE mr.matching_id = (SELECT id FROM matching_request WHERE lesson_content = '[더미작성가능2] 기초 근력 만들고 싶어요' LIMIT 1)
        LIMIT 1),
    (SELECT id FROM members WHERE user_id = 'user01'),
                                (SELECT tp.id FROM trainer_profiles tp JOIN members m ON tp.user_id = m.id WHERE m.user_id = 'trainer06' LIMIT 1),
    'ONE_TIME', NULL, '2026-06-16', '14:00:00', '15:00:00', '잘 부탁드립니다!', 'ACCEPTED', NOW(), NOW();


-- ───────── user03 → trainer11(현우코치) 성사 ─────────
-- 1) 매칭 요청
INSERT IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id, '중급', '크로스핏', '1:1', '인천', 60000, 100000, '[더미작성가능3] 크로스핏 입문하고 싶어요', NOW(), NOW()
FROM members WHERE user_id = 'user03';

-- 2) 사용자 희망 시간
INSERT IGNORE INTO matching_preferred_times (matching_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[더미작성가능3] 크로스핏 입문하고 싶어요' LIMIT 1),
       'WEDNESDAY', '19:00:00', '20:00:00', NOW(), NOW();

-- 3) 트레이너 가능 시간 (trainer11)
INSERT IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'WEDNESDAY', '18:00:00', '22:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer11';

-- 4) 매칭 결과
INSERT IGNORE INTO matching_results (matching_id, preferred_time_id, trainer_available_time_id, trainer_profile_id, created_at, updated_at)
SELECT
    (SELECT id FROM matching_request WHERE lesson_content = '[더미작성가능3] 크로스핏 입문하고 싶어요' LIMIT 1),
    (SELECT pt.id FROM matching_preferred_times pt
        WHERE pt.matching_id = (SELECT id FROM matching_request WHERE lesson_content = '[더미작성가능3] 크로스핏 입문하고 싶어요' LIMIT 1)
        LIMIT 1),
    (SELECT at.id FROM trainer_available_times at
        JOIN trainer_profiles tp ON at.trainer_profile_id = tp.id
        JOIN members m ON tp.user_id = m.id
        WHERE m.user_id = 'trainer11' AND at.start_time = '18:00:00'
        LIMIT 1),
    (SELECT tp.id FROM trainer_profiles tp JOIN members m ON tp.user_id = m.id WHERE m.user_id = 'trainer11' LIMIT 1),
    NOW(), NOW();

-- 5) 레슨 요청 (ACCEPTED = 성사)
INSERT IGNORE INTO lesson_requests (matching_result_id, member_id, trainer_profile_id, lesson_pass_type, weekly_count, requested_date, requested_start_time, requested_end_time, message, status, created_at, updated_at)
SELECT
    (SELECT mr.id FROM matching_results mr
     WHERE mr.matching_id = (SELECT id FROM matching_request WHERE lesson_content = '[더미작성가능3] 크로스핏 입문하고 싶어요' LIMIT 1)
        LIMIT 1),
    (SELECT id FROM members WHERE user_id = 'user03'),
                                (SELECT tp.id FROM trainer_profiles tp JOIN members m ON tp.user_id = m.id WHERE m.user_id = 'trainer11' LIMIT 1),
    'ONE_TIME', NULL, '2026-06-17', '19:00:00', '20:00:00', '잘 부탁드립니다!', 'ACCEPTED', NOW(), NOW();