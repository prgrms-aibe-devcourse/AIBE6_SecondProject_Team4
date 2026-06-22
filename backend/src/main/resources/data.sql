-- =============================================
-- FitMate 더미 데이터
-- ddl-auto: create 환경에서 앱 실행 시 자동 적용
-- 비밀번호: 모두 'password123' BCrypt 인코딩
-- =============================================

-- =============================================
-- 회원 (members)
-- =============================================
INSERT
IGNORE INTO members (user_id, user_name, password, nickname, email, role, profile_image, region, introduction, phone, created_at, updated_at)
VALUES
    ('user01', '김철수', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '철수', 'user01@fitmate.com', 'USER', NULL, '서울', '운동 초보입니다.', '010-1111-1111', NOW(), NOW()),
    ('user02', '이영희', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '영희', 'user02@fitmate.com', 'USER', NULL, '부산', '다이어트가 목표입니다.', '010-2222-2222', NOW(), NOW()),
    ('user03', '박민준', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '민준', 'user03@fitmate.com', 'USER', NULL, '인천', '근육 키우고 싶어요.', '010-3333-3333', NOW(), NOW()),
    ('user04', '최유진', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '유진', 'user04@fitmate.com', 'USER', NULL, '서울', '자세 교정과 유연성 향상이 목표입니다.', '010-4444-0004', NOW(), NOW()),
    ('user05', '한지우', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '지우', 'user05@fitmate.com', 'USER', NULL, '부산', '꾸준히 운동할 수 있는 코치를 찾고 있습니다.', '010-5555-0005', NOW(), NOW()),
    ('trainer01', '최민호', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '최코치', 'trainer01@fitmate.com', 'TRAINER', '/uploads/profile/남3.png', '서울', '10년 경력의 PT 전문 트레이너입니다.', '010-4444-4444', NOW(), NOW()),
    ('trainer02', '정상훈', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '정코치', 'trainer02@fitmate.com', 'TRAINER', '/uploads/profile/남5.png', '부산', '수영, 필라테스 전문입니다.', '010-5555-5555', NOW(), NOW()),
    ('trainer03', '김태양', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '태양코치', 'trainer03@fitmate.com', 'TRAINER', '/uploads/profile/남8.png', '서울', '필라테스 전문 트레이너입니다.', '010-6001-0003', NOW(), NOW()),
    ('trainer04', '이준호', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '준호코치', 'trainer04@fitmate.com', 'TRAINER', '/uploads/profile/남9.png', '부산', '크로스핏 전문가입니다.', '010-6001-0004', NOW(), NOW()),
    ('trainer05', '박서연', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '서연코치', 'trainer05@fitmate.com', 'TRAINER', '/uploads/profile/여5.png', '인천', '요가 10년 경력입니다.', '010-6001-0005', NOW(), NOW()),
    ('trainer06', '최민기', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '민기코치', 'trainer06@fitmate.com', 'TRAINER', '/uploads/profile/남7.png', '대구', '헬스 전문 트레이너입니다.', '010-6001-0006', NOW(), NOW()),
    ('trainer07', '정하은', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '하은코치', 'trainer07@fitmate.com', 'TRAINER', '/uploads/profile/여6.png', '광주', '수영 국가대표 출신입니다.', '010-6001-0007', NOW(), NOW()),
    ('trainer08', '한도윤', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '도윤코치', 'trainer08@fitmate.com', 'TRAINER', '/uploads/profile/남10.png', '대전', '테니스 레슨 전문입니다.', '010-6001-0008', NOW(), NOW()),
    ('trainer09', '오지민', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '오지민프로', 'trainer09@fitmate.com', 'TRAINER', '/uploads/profile/여7.png', '서울', '골프 레슨 전문가입니다.', '010-6001-0009', NOW(), NOW()),
    ('trainer10', '서윤아', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '윤아코치', 'trainer10@fitmate.com', 'TRAINER', '/uploads/profile/여8.png', '부산', '댄스 전문 강사입니다.', '010-6001-0010', NOW(), NOW()),
    ('trainer11', '강현우', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '현우코치', 'trainer11@fitmate.com', 'TRAINER', '/uploads/profile/남4.png', '인천', '헬스, 크로스핏 트레이너입니다.', '010-6001-0011', NOW(), NOW()),
    ('trainer12', '윤소희', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '소희코치', 'trainer12@fitmate.com', 'TRAINER', '/uploads/profile/여4.png', '서울', '필라테스, 요가 강사입니다.', '010-6001-0012', NOW(), NOW()),
    ('trainer13', '임재현', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '재현코치', 'trainer13@fitmate.com', 'TRAINER', '/uploads/profile/남2.png', '대구', '수영 전문 트레이너입니다.', '010-6001-0013', NOW(), NOW()),
    ('trainer14', '신예진', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '예진코치', 'trainer14@fitmate.com', 'TRAINER', '/uploads/profile/여3.png', '광주', '댄스, 요가 강사입니다.', '010-6001-0014', NOW(), NOW()),
    ('trainer15', '조성민', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '성민코치', 'trainer15@fitmate.com', 'TRAINER', '/uploads/profile/남6.png', '대전', '헬스 전문 트레이너입니다.', '010-6001-0015', NOW(), NOW()),
    ('trainer16', '권나연', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '나연코치', 'trainer16@fitmate.com', 'TRAINER', '/uploads/profile/여2.png', '서울', '테니스, 골프 트레이너입니다.', '010-6001-0016', NOW(), NOW()),
    ('trainer17', '문재호', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '재호코치', 'trainer17@fitmate.com', 'TRAINER', '/uploads/profile/남1.png', '부산', '크로스핏 전문가입니다.', '010-6001-0017', NOW(), NOW()),
    ('trainer18', '백수진', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '수진코치', 'trainer18@fitmate.com', 'TRAINER', '/uploads/profile/여1.png', '인천', '필라테스 전문 트레이너입니다.', '010-6001-0018', NOW(), NOW()),
    ('admin01', '관리자', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '관리자', 'admin@fitmate.com', 'ADMIN', NULL, NULL, NULL, '010-0000-0000', NOW(), NOW());
-- =============================================
-- 트레이너 추가 (trainer19~trainer48)
-- =============================================
INSERT
IGNORE INTO members (user_id, user_name, password, nickname, email, role, profile_image, region, introduction, phone, created_at, updated_at)
VALUES
    -- 남자 트레이너 16명
    ('trainer19', '김도현', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '도현코치', 'trainer19@fitmate.com', 'TRAINER', '/uploads/profile/도현코치.png', '서울', '근력 운동 전문 트레이너입니다.', '010-6001-0019', NOW(), NOW()),
    ('trainer20', '이상우', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '상우코치', 'trainer20@fitmate.com', 'TRAINER', '/uploads/profile/상우코치.png', '서울', '크로스핏 코치입니다.', '010-6001-0020', NOW(), NOW()),
    ('trainer21', '박지훈', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '지훈코치', 'trainer21@fitmate.com', 'TRAINER', '/uploads/profile/지훈코치.png', '서울', '헬스 전문 트레이너입니다.', '010-6001-0021', NOW(), NOW()),
    ('trainer22', '최성호', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '성호코치', 'trainer22@fitmate.com', 'TRAINER', '/uploads/profile/성호코치.png', '경기', '크로스핏과 헬스를 가르칩니다.', '010-6001-0022', NOW(), NOW()),
    ('trainer23', '정우진', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '우진코치', 'trainer23@fitmate.com', 'TRAINER', '/uploads/profile/우진코치.png', '경기', '헬스 전문 트레이너입니다.', '010-6001-0023', NOW(), NOW()),
    ('trainer24', '한승민', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '승민코치', 'trainer24@fitmate.com', 'TRAINER', '/uploads/profile/승민코치.png', '부산', '테니스 레슨 전문입니다.', '010-6001-0024', NOW(), NOW()),
    ('trainer25', '윤재호', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '재호프로', 'trainer25@fitmate.com', 'TRAINER', '/uploads/profile/재호프로.png', '부산', '골프 스윙 교정 전문가입니다.', '010-6001-0025', NOW(), NOW()),
    ('trainer26', '강민수', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '민수코치', 'trainer26@fitmate.com', 'TRAINER', '/uploads/profile/민수코치.png', '인천', '헬스 전문 트레이너입니다.', '010-6001-0026', NOW(), NOW()),
    ('trainer27', '조현준', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '현준코치', 'trainer27@fitmate.com', 'TRAINER', '/uploads/profile/현준코치.png', '인천', '크로스핏 코치입니다.', '010-6001-0027', NOW(), NOW()),
    ('trainer28', '신동현', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '동현코치', 'trainer28@fitmate.com', 'TRAINER', '/uploads/profile/동현코치.png', '대구', '수영 전문 트레이너입니다.', '010-6001-0028', NOW(), NOW()),
    ('trainer29', '임태준', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '태준코치', 'trainer29@fitmate.com', 'TRAINER', '/uploads/profile/태준코치.png', '대구', '헬스 전문 트레이너입니다.', '010-6001-0029', NOW(), NOW()),
    ('trainer30', '오준영', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '준영코치', 'trainer30@fitmate.com', 'TRAINER', '/uploads/profile/준영코치.png', '광주', '크로스핏과 헬스를 가르칩니다.', '010-6001-0030', NOW(), NOW()),
    ('trainer31', '서민재', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '민재코치', 'trainer31@fitmate.com', 'TRAINER', '/uploads/profile/민재코치.png', '광주', '헬스 전문 트레이너입니다.', '010-6001-0031', NOW(), NOW()),
    ('trainer32', '권용우', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '용우프로', 'trainer32@fitmate.com', 'TRAINER', '/uploads/profile/용우프로.png', '대전', '골프 레슨 전문가입니다.', '010-6001-0032', NOW(), NOW()),
    ('trainer33', '황지석', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '지석코치', 'trainer33@fitmate.com', 'TRAINER', '/uploads/profile/지석코치.png', '대전', '테니스 트레이너입니다.', '010-6001-0033', NOW(), NOW()),
    ('trainer34', '문서준', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '서준코치', 'trainer34@fitmate.com', 'TRAINER', '/uploads/profile/서준코치.png', '서울', '크로스핏 코치입니다.', '010-6001-0034', NOW(), NOW()),

    -- 여자 트레이너 15명
    ('trainer35', '김다은', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '다은코치', 'trainer35@fitmate.com', 'TRAINER', '/uploads/profile/다은코치.png', '서울', '필라테스 전문 강사입니다.', '010-6001-0035', NOW(), NOW()),
    ('trainer36', '이서윤', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '서윤코치', 'trainer36@fitmate.com', 'TRAINER', '/uploads/profile/서윤코치.png', '서울', '요가 강사입니다.', '010-6001-0036', NOW(), NOW()),
    ('trainer37', '박지민', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '지민트레이너', 'trainer37@fitmate.com', 'TRAINER', '/uploads/profile/지민트레이너.png' , '서울', '헬스 전문 트레이너입니다.', '010-6001-0037', NOW(), NOW()),
    ('trainer38', '최유나', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '유나코치', 'trainer38@fitmate.com', 'TRAINER', '/uploads/profile/유나코치.png', '경기', '필라테스, 요가 강사입니다.', '010-6001-0038', NOW(), NOW()),
    ('trainer39', '정하윤', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '하윤코치', 'trainer39@fitmate.com', 'TRAINER', '/uploads/profile/하윤코치.png', '경기', '요가 강사입니다.', '010-6001-0039', NOW(), NOW()),
    ('trainer40', '한소연', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '소연T', 'trainer40@fitmate.com', 'TRAINER', '/uploads/profile/소연T.png', '부산', '댄스 전문 강사입니다.', '010-6001-0040', NOW(), NOW()),
    ('trainer41', '윤채영', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '채영코치', 'trainer41@fitmate.com', 'TRAINER', '/uploads/profile/채영코치.png', '부산', '필라테스 전문 강사입니다.', '010-6001-0041', NOW(), NOW()),
    ('trainer42', '강은서', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '은서코치', 'trainer42@fitmate.com', 'TRAINER', '/uploads/profile/은서코치.png', '인천', '헬스 전문 트레이너입니다.', '010-6001-0042', NOW(), NOW()),
    ('trainer43', '조수아', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '수아코치', 'trainer43@fitmate.com', 'TRAINER', '/uploads/profile/수아코치.png', '인천', '요가, 필라테스 강사입니다.', '010-6001-0043', NOW(), NOW()),
    ('trainer44', '신예은', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '예은T', 'trainer44@fitmate.com', 'TRAINER', '/uploads/profile/예은T.png', '대구', '댄스 전문 강사입니다.', '010-6001-0044', NOW(), NOW()),
    ('trainer45', '임수빈', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '수빈코치', 'trainer45@fitmate.com', 'TRAINER', '/uploads/profile/수빈코치.png', '대구', '필라테스 전문 강사입니다.', '010-6001-0045', NOW(), NOW()),
    ('trainer46', '오지유', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '지유코치', 'trainer46@fitmate.com', 'TRAINER', '/uploads/profile/지유코치.png', '광주', '요가 강사입니다.', '010-6001-0046', NOW(), NOW()),
    ('trainer47', '배수정', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '수정프로', 'trainer47@fitmate.com', 'TRAINER', '/uploads/profile/수정프로.png', '대전', '골프 레슨 전문가입니다.', '010-6001-0047', NOW(), NOW()),
    ('trainer48', '권나윤', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '나윤코치', 'trainer48@fitmate.com', 'TRAINER', '/uploads/profile/나윤코치.png', '대전', '필라테스, 헬스 트레이너입니다.', '010-6001-0048', NOW(), NOW());

-- =============================================
-- 회원 추가 (user06~user25)
-- =============================================
INSERT
IGNORE INTO members (user_id, user_name, password, nickname, email, role, profile_image, region, introduction, phone, created_at, updated_at)
VALUES
    ('user06', '강동훈', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '동훈', 'user06@fitmate.com', 'USER', NULL, '서울', '체력 향상이 목표입니다.', '010-7001-0006', NOW(), NOW()),
    ('user07', '윤서아', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '서아', 'user07@fitmate.com', 'USER', NULL, '서울', '요가로 유연성을 기르고 싶어요.', '010-7001-0007', NOW(), NOW()),
    ('user08', '임재윤', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '재윤', 'user08@fitmate.com', 'USER', NULL, '서울', '헬스 초보입니다.', '010-7001-0008', NOW(), NOW()),
    ('user09', '한가은', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '가은', 'user09@fitmate.com', 'USER', NULL, '경기', '필라테스로 체형 교정하고 싶어요.', '010-7001-0009', NOW(), NOW()),
    ('user10', '오태양', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '태양', 'user10@fitmate.com', 'USER', NULL, '경기', '크로스핏에 도전하고 싶습니다.', '010-7001-0010', NOW(), NOW()),
    ('user11', '신유빈', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '유빈', 'user11@fitmate.com', 'USER', NULL, '부산', '수영을 배우고 싶어요.', '010-7001-0011', NOW(), NOW()),
    ('user12', '조민재', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '민재', 'user12@fitmate.com', 'USER', NULL, '부산', '근력 운동을 시작하려고 해요.', '010-7001-0012', NOW(), NOW()),
    ('user13', '백서윤', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '서윤', 'user13@fitmate.com', 'USER', NULL, '인천', '댄스를 배워보고 싶습니다.', '010-7001-0013', NOW(), NOW()),
    ('user14', '권도윤', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '도윤', 'user14@fitmate.com', 'USER', NULL, '인천', '골프 레슨을 받고 싶어요.', '010-7001-0014', NOW(), NOW()),
    ('user15', '문지호', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '지호', 'user15@fitmate.com', 'USER', NULL, '대구', '테니스를 처음 배우려고 합니다.', '010-7001-0015', NOW(), NOW()),
    ('user16', '서하은', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '하은', 'user16@fitmate.com', 'USER', NULL, '대구', '요가로 스트레스를 풀고 싶어요.', '010-7001-0016', NOW(), NOW()),
    ('user17', '황준서', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '준서', 'user17@fitmate.com', 'USER', NULL, '광주', '헬스로 체중 관리하고 싶습니다.', '010-7001-0017', NOW(), NOW()),
    ('user18', '김나윤', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '나윤', 'user18@fitmate.com', 'USER', NULL, '광주', '필라테스 초보입니다.', '010-7001-0018', NOW(), NOW()),
    ('user19', '이시우', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '시우', 'user19@fitmate.com', 'USER', NULL, '대전', '크로스핏으로 체력 키우고 싶어요.', '010-7001-0019', NOW(), NOW()),
    ('user20', '박소율', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '소율', 'user20@fitmate.com', 'USER', NULL, '대전', '요가로 유연성을 기르고 싶어요.', '010-7001-0020', NOW(), NOW()),
    ('user21', '최은우', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '은우', 'user21@fitmate.com', 'USER', NULL, '서울', '수영 기초를 배우고 싶습니다.', '010-7001-0021', NOW(), NOW()),
    ('user22', '정아인', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '아인', 'user22@fitmate.com', 'USER', NULL, '서울', '댄스로 활력을 찾고 싶어요.', '010-7001-0022', NOW(), NOW()),
    ('user23', '한주원', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '주원', 'user23@fitmate.com', 'USER', NULL, '경기', '헬스로 근육량을 늘리고 싶어요.', '010-7001-0023', NOW(), NOW()),
    ('user24', '오시은', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '시은', 'user24@fitmate.com', 'USER', NULL, '경기', '필라테스로 자세 교정하고 싶습니다.', '010-7001-0024', NOW(), NOW()),
    ('user25', '강현서', '$2a$10$N4tjEvVAtSjNWpipNlM42ekDjrErWjsaEJgbV5HIEVkNv3WDRUSAS', '현서', 'user25@fitmate.com', 'USER', NULL, '부산', '골프를 취미로 시작하려고 합니다.', '010-7001-0025', NOW(), NOW());

-- =============================================
-- 사용자 프로필 (user_profiles)
-- =============================================
INSERT
IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '헬스', '입문/초보', '다이어트', NOW(), NOW()
FROM members
WHERE user_id = 'user01';

INSERT
IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '수영', '입문/초보', '체형 교정', NOW(), NOW()
FROM members
WHERE user_id = 'user02';

INSERT
IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '헬스', '중급', '근력 향상', NOW(), NOW()
FROM members
WHERE user_id = 'user03';

INSERT
IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '필라테스', '입문/초보', '자세 교정', NOW(), NOW()
FROM members
WHERE user_id = 'user04';

INSERT
IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '크로스핏', '중급', '체력 향상', NOW(), NOW()
FROM members
WHERE user_id = 'user05';

-- =============================================
-- 사용자 프로필 추가 (user06~user25)
-- =============================================
INSERT IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '헬스', '입문/초보', '체력 향상', NOW(), NOW() FROM members WHERE user_id = 'user06';

INSERT IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '요가', '입문/초보', '스트레스 해소', NOW(), NOW() FROM members WHERE user_id = 'user07';

INSERT IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '헬스', '입문/초보', '다이어트', NOW(), NOW() FROM members WHERE user_id = 'user08';

INSERT IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '필라테스', '입문/초보', '체형 교정', NOW(), NOW() FROM members WHERE user_id = 'user09';

INSERT IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '크로스핏', '입문/초보', '체력 향상', NOW(), NOW() FROM members WHERE user_id = 'user10';

INSERT IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '수영', '입문/초보', '체형 교정', NOW(), NOW() FROM members WHERE user_id = 'user11';

INSERT IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '헬스', '중급', '근력 향상', NOW(), NOW() FROM members WHERE user_id = 'user12';

INSERT IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '댄스', '입문/초보', '스트레스 해소', NOW(), NOW() FROM members WHERE user_id = 'user13';

INSERT IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '골프', '입문/초보', '건강 유지', NOW(), NOW() FROM members WHERE user_id = 'user14';

INSERT IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '테니스', '입문/초보', '체력 향상', NOW(), NOW() FROM members WHERE user_id = 'user15';

INSERT IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '요가', '중급', '스트레스 해소', NOW(), NOW() FROM members WHERE user_id = 'user16';

INSERT IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '헬스', '입문/초보', '다이어트', NOW(), NOW() FROM members WHERE user_id = 'user17';

INSERT IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '필라테스', '입문/초보', '체형 교정', NOW(), NOW() FROM members WHERE user_id = 'user18';

INSERT IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '크로스핏', '중급', '체력 향상', NOW(), NOW() FROM members WHERE user_id = 'user19';

INSERT IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '요가', '입문/초보', '스트레스 해소', NOW(), NOW() FROM members WHERE user_id = 'user20';

INSERT IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '수영', '입문/초보', '건강 유지', NOW(), NOW() FROM members WHERE user_id = 'user21';

INSERT IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '댄스', '입문/초보', '스트레스 해소', NOW(), NOW() FROM members WHERE user_id = 'user22';

INSERT IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '헬스', '중급', '근력 향상', NOW(), NOW() FROM members WHERE user_id = 'user23';

INSERT IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '필라테스', '입문/초보', '자세 교정', NOW(), NOW() FROM members WHERE user_id = 'user24';

INSERT IGNORE INTO user_profiles (user_id, sports, level, goal, created_at, updated_at)
SELECT id, '골프', '입문/초보', '건강 유지', NOW(), NOW() FROM members WHERE user_id = 'user25';
-- =============================================
-- 트레이너 프로필 (trainer_profiles)
-- =============================================
INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '헬스,크로스핏',
       'ONE_TO_ONE',
       '입문/초보,중급,고급/대회준비',
       80000,
       10,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer01';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '수영,필라테스',
       'GROUP',
       '입문/초보,중급',
       60000,
       5,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer02';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '필라테스',
       'ONE_TO_ONE',
       '입문/초보,중급',
       70000,
       4,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer03';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '크로스핏',
       'GROUP',
       '중급,고급/대회준비',
       65000,
       6,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer04';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '요가',
       'ONE_TO_ONE',
       '입문/초보,중급,고급/대회준비',
       90000,
       10,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer05';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '헬스',
       'ONE_TO_ONE',
       '입문/초보',
       50000,
       2,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer06';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '수영',
       'GROUP',
       '중급,고급/대회준비',
       75000,
       8,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer07';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '테니스',
       'ONE_TO_ONE,GROUP',
       '중급,고급/대회준비',
       100000,
       12,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer08';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '골프',
       'ONE_TO_ONE',
       '입문/초보,중급',
       120000,
       7,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer09';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '댄스',
       'ONE_TO_ONE,GROUP',
       '입문/초보',
       55000,
       3,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer10';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '헬스,크로스핏',
       'ONE_TO_ONE',
       '중급,고급/대회준비',
       85000,
       9,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer11';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '필라테스,요가',
       'ONE_TO_ONE,GROUP',
       '입문/초보,중급',
       80000,
       5,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer12';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '수영',
       'ONE_TO_ONE',
       '입문/초보',
       60000,
       4,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer13';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '댄스,요가',
       'GROUP',
       '중급',
       58000,
       5,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer14';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '헬스',
       'ONLINE,GROUP',
       '입문/초보,중급',
       45000,
       3,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer15';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '테니스,골프',
       'ONE_TO_ONE',
       '고급/대회준비',
       130000,
       15,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer16';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '크로스핏',
       'ONE_TO_ONE',
       '중급,고급/대회준비',
       95000,
       11,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer17';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '필라테스',
       'GROUP',
       '입문/초보,중급',
       67000,
       6,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer18';

-- =============================================
-- 트레이너 프로필 추가 (trainer19~trainer48)
-- =============================================
INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '헬스',
       'ONE_TO_ONE',
       '입문/초보,중급',
       60000,
       5,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer19';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '크로스핏',
       'GROUP',
       '중급,고급/대회준비',
       70000,
       7,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer20';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '헬스,크로스핏',
       'ONE_TO_ONE',
       '입문/초보,중급',
       65000,
       6,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer21';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '크로스핏',
       'ONE_TO_ONE',
       '중급,고급/대회준비',
       80000,
       9,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer22';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '헬스',
       'ONE_TO_ONE',
       '입문/초보',
       50000,
       3,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer23';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '테니스',
       'ONE_TO_ONE',
       '중급,고급/대회준비',
       95000,
       10,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer24';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '골프',
       'ONE_TO_ONE',
       '입문/초보,중급',
       110000,
       8,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer25';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '헬스',
       'ONE_TO_ONE',
       '중급,고급/대회준비',
       70000,
       8,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer26';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '크로스핏',
       'GROUP',
       '입문/초보,중급',
       60000,
       4,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer27';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '수영',
       'ONE_TO_ONE',
       '입문/초보,중급',
       65000,
       6,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer28';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '헬스',
       'ONE_TO_ONE',
       '입문/초보,중급',
       55000,
       4,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer29';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '크로스핏,헬스',
       'ONE_TO_ONE',
       '중급,고급/대회준비',
       85000,
       11,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer30';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '헬스',
       'ONE_TO_ONE',
       '입문/초보',
       48000,
       2,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer31';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '골프',
       'ONE_TO_ONE',
       '중급,고급/대회준비',
       125000,
       13,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer32';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '테니스',
       'ONE_TO_ONE',
       '입문/초보,중급',
       90000,
       9,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer33';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '크로스핏',
       'ONE_TO_ONE',
       '중급',
       75000,
       7,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer34';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '필라테스',
       'ONE_TO_ONE',
       '입문/초보,중급',
       70000,
       6,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer35';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '요가',
       'GROUP',
       '입문/초보,중급,고급/대회준비',
       65000,
       8,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer36';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '헬스',
       'ONE_TO_ONE',
       '입문/초보,중급',
       58000,
       4,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer37';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '필라테스,요가',
       'ONE_TO_ONE',
       '중급,고급/대회준비',
       80000,
       9,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer38';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '요가',
       'ONE_TO_ONE',
       '입문/초보',
       50000,
       3,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer39';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '댄스',
       'GROUP',
       '입문/초보,중급',
       55000,
       5,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer40';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '필라테스',
       'ONE_TO_ONE',
       '중급,고급/대회준비',
       78000,
       7,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer41';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '헬스',
       'ONE_TO_ONE',
       '입문/초보,중급',
       62000,
       5,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer42';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '요가,필라테스',
       'ONE_TO_ONE',
       '입문/초보,중급',
       72000,
       6,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer43';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '댄스',
       'GROUP',
       '중급,고급/대회준비',
       60000,
       6,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer44';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '필라테스',
       'ONE_TO_ONE',
       '입문/초보',
       52000,
       3,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer45';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '요가',
       'ONE_TO_ONE',
       '중급,고급/대회준비',
       85000,
       10,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer46';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '골프',
       'ONE_TO_ONE',
       '입문/초보,중급',
       115000,
       9,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer47';

INSERT
IGNORE INTO trainer_profiles (user_id, sports, lesson_type, lesson_level, price, career_years, created_at, updated_at)
SELECT id,
       '필라테스,헬스',
       'ONE_TO_ONE',
       '입문/초보,중급',
       68000,
       5,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'trainer48';
-- =============================================
-- 복수 추천 테스트용 트레이너 조건 확장
-- 기존 전문 분야는 유지하고 같은 지역의 트레이너끼리 보조 조건만 겹치게 구성
-- =============================================
UPDATE trainer_profiles tp
    JOIN members m
ON tp.user_id = m.id
    SET tp.sports = '크로스핏,댄스', tp.lesson_level = '입문/초보,중급,고급/대회준비'
WHERE m.user_id = 'trainer04';

UPDATE trainer_profiles tp
    JOIN members m
ON tp.user_id = m.id
    SET tp.sports = '수영,헬스'
WHERE m.user_id = 'trainer13';

UPDATE trainer_profiles tp
    JOIN members m
ON tp.user_id = m.id
    SET tp.sports = '댄스,요가,수영'
WHERE m.user_id = 'trainer14';

UPDATE trainer_profiles tp
    JOIN members m
ON tp.user_id = m.id
    SET tp.sports = '헬스,테니스', tp.lesson_type = 'ONLINE,ONE_TO_ONE'
WHERE m.user_id = 'trainer15';

UPDATE trainer_profiles tp
    JOIN members m
ON tp.user_id = m.id
    SET tp.lesson_level = '중급,고급/대회준비'
WHERE m.user_id = 'trainer16';

UPDATE trainer_profiles tp
    JOIN members m
ON tp.user_id = m.id
    SET tp.lesson_type = 'ONE_TO_ONE,GROUP'
WHERE m.user_id = 'trainer17';

UPDATE trainer_profiles tp
    JOIN members m
ON tp.user_id = m.id
    SET tp.sports = '필라테스,요가,헬스', tp.lesson_type = 'GROUP,ONE_TO_ONE'
WHERE m.user_id = 'trainer18';

-- =============================================
-- 매칭 요청 (matching_request)
-- =============================================
INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '초급',
       '헬스',
       '1:1 PT',
       '서울',
       50000,
       100000,
       '체중 감량과 기초 체력 향상을 원합니다.',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user01';

INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '초급',
       '수영',
       '그룹',
       '부산',
       30000,
       60000,
       '수영 기초부터 배우고 싶습니다.',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user02';

INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '중급',
       '헬스',
       '1:1 PT',
       '인천',
       60000,
       120000,
       '근육량 증가가 목표입니다.',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user03';

-- =============================================
-- 알림 (alert)
-- =============================================
INSERT
IGNORE INTO alert (receiver_id, type, target_id, content, is_read, created_at, updated_at)
SELECT id, 'INQUIRY', 1, '문의하신 내용에 답변이 등록되었습니다.', false, NOW(), NOW()
FROM members
WHERE user_id = 'user03';

-- =============================================
-- 문의 (inquiries)
-- =============================================
INSERT
IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id,
       'ETC',
       '앱 오류 문의드립니다.',
       '앱 사용 중 갑자기 종료되는 현상이 발생합니다.',
       'PENDING',
       NULL,
       NOW() - INTERVAL 19 DAY, NOW() - INTERVAL 19 DAY
FROM members
WHERE user_id = 'user01';

INSERT
IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id,
       'MATCHING',
       '매칭이 안 되는 것 같아요.',
       '매칭 요청을 했는데 연락이 없습니다.',
       'RESOLVED',
       '담당자 확인 후 처리하였습니다. 이용에 불편을 드려 죄송합니다.',
       NOW() - INTERVAL 18 DAY, NOW() - INTERVAL 18 DAY
FROM members
WHERE user_id = 'user02';

INSERT
IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id,
       'TRAINER',
       '트레이너 변경이 가능한가요?',
       '현재 매칭된 트레이너를 변경하고 싶습니다.',
       'PENDING',
       NULL,
       NOW() - INTERVAL 17 DAY, NOW() - INTERVAL 17 DAY
FROM members
WHERE user_id = 'user03';

INSERT
IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id,
       'MATCHING',
       '매칭 취소 방법을 알고 싶어요.',
       '매칭을 취소하고 싶은데 어떻게 하면 되나요?',
       'RESOLVED',
       '마이페이지 > 매칭 내역에서 취소가 가능합니다.',
       NOW() - INTERVAL 16 DAY, NOW() - INTERVAL 16 DAY
FROM members
WHERE user_id = 'user01';

INSERT
IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id,
       'TRAINER',
       '트레이너 프로필이 보이지 않아요.',
       '검색해도 트레이너 목록이 나타나지 않습니다.',
       'PENDING',
       NULL,
       NOW() - INTERVAL 15 DAY, NOW() - INTERVAL 15 DAY
FROM members
WHERE user_id = 'user02';

INSERT
IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id,
       'ETC',
       '알림이 오지 않아요.',
       '매칭 관련 알림을 받지 못하고 있습니다.',
       'RESOLVED',
       '알림 설정을 확인해 주세요. 문제가 지속되면 재설치를 권장합니다.',
       NOW() - INTERVAL 14 DAY, NOW() - INTERVAL 14 DAY
FROM members
WHERE user_id = 'user03';

INSERT
IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id,
       'TRAINER',
       '트레이너 리뷰 작성이 안 돼요.',
       '수업 완료 후 리뷰를 작성하려는데 버튼이 비활성화되어 있습니다.',
       'PENDING',
       NULL,
       NOW() - INTERVAL 13 DAY, NOW() - INTERVAL 13 DAY
FROM members
WHERE user_id = 'user01';

INSERT
IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id,
       'MATCHING',
       '매칭 조건 수정이 가능한가요?',
       '이미 등록한 매칭 요청의 조건을 변경하고 싶습니다.',
       'RESOLVED',
       '매칭 요청 수정은 마이페이지에서 가능합니다.',
       NOW() - INTERVAL 12 DAY, NOW() - INTERVAL 12 DAY
FROM members
WHERE user_id = 'user02';

INSERT
IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id,
       'ETC',
       '회원 탈퇴는 어떻게 하나요?',
       '서비스를 더 이상 이용하지 않으려 합니다. 탈퇴 방법을 알고 싶습니다.',
       'PENDING',
       NULL,
       NOW() - INTERVAL 11 DAY, NOW() - INTERVAL 11 DAY
FROM members
WHERE user_id = 'user03';

INSERT
IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id,
       'TRAINER',
       '트레이너와 연락이 안 됩니다.',
       '매칭 후 트레이너에게 연락을 시도했는데 응답이 없습니다.',
       'RESOLVED',
       '트레이너에게 연락을 취했습니다. 불편을 드려 죄송합니다.',
       NOW() - INTERVAL 10 DAY, NOW() - INTERVAL 10 DAY
FROM members
WHERE user_id = 'user01';

INSERT
IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id,
       'MATCHING',
       '매칭 요청이 반려되었습니다.',
       '매칭 요청이 반려되었는데 이유를 알 수 있을까요?',
       'PENDING',
       NULL,
       NOW() - INTERVAL 9 DAY, NOW() - INTERVAL 9 DAY
FROM members
WHERE user_id = 'user02';

INSERT
IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id,
       'ETC',
       '프로필 사진이 업로드가 안 돼요.',
       '프로필 사진을 변경하려는데 업로드가 되지 않습니다.',
       'RESOLVED',
       '지원 이미지 형식은 JPG, PNG입니다. 파일 크기는 5MB 이하여야 합니다.',
       NOW() - INTERVAL 8 DAY, NOW() - INTERVAL 8 DAY
FROM members
WHERE user_id = 'user03';

INSERT
IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id,
       'TRAINER',
       '트레이너 전문 분야를 더 추가할 수 있나요?',
       '트레이너 프로필에 전문 분야를 추가로 등록하고 싶습니다.',
       'PENDING',
       NULL,
       NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 7 DAY
FROM members
WHERE user_id = 'user01';

INSERT
IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id,
       'MATCHING',
       '매칭 후 일정 조율은 어떻게 하나요?',
       '트레이너와 수업 일정을 어떻게 조율하면 되는지 궁금합니다.',
       'RESOLVED',
       '매칭 완료 후 채팅 기능을 통해 트레이너와 직접 일정을 조율하실 수 있습니다.',
       NOW() - INTERVAL 6 DAY, NOW() - INTERVAL 6 DAY
FROM members
WHERE user_id = 'user02';

INSERT
IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id,
       'ETC',
       '비밀번호를 잊어버렸어요.',
       '로그인 시 비밀번호가 기억나지 않습니다.',
       'PENDING',
       NULL,
       NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY
FROM members
WHERE user_id = 'user03';

INSERT
IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id,
       'TRAINER',
       '트레이너 수업 지역 변경이 가능한가요?',
       '현재 등록된 수업 지역을 변경하고 싶습니다.',
       'RESOLVED',
       '트레이너 프로필 수정 페이지에서 수업 지역을 변경하실 수 있습니다.',
       NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 4 DAY
FROM members
WHERE user_id = 'user01';

INSERT
IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id,
       'MATCHING',
       '원하는 트레이너가 없어요.',
       '조건에 맞는 트레이너가 검색되지 않습니다.',
       'PENDING',
       NULL,
       NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY
FROM members
WHERE user_id = 'user02';

INSERT
IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id,
       'ETC',
       '닉네임 변경이 안 됩니다.',
       '닉네임을 변경하려고 하는데 저장이 되지 않습니다.',
       'RESOLVED',
       '닉네임은 특수문자를 포함할 수 없습니다. 확인 후 다시 시도해 주세요.',
       NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY
FROM members
WHERE user_id = 'user03';

INSERT
IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id,
       'TRAINER',
       '수업 후기가 삭제되었어요.',
       '작성한 트레이너 후기가 사라졌습니다.',
       'PENDING',
       NULL,
       NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY
FROM members
WHERE user_id = 'user01';

INSERT
IGNORE INTO inquiries (member_id, type, title, content, status, answer, created_at, updated_at)
SELECT id,
       'MATCHING',
       '매칭 완료 후 환불이 가능한가요?',
       '사정이 생겨 수업을 받지 못할 것 같습니다.',
       'PENDING',
       NULL,
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user02';

-- =============================================
-- 후기용 매칭 요청 추가
-- 후기는 matching_id UNIQUE 제약이 있어 매칭 1개당 후기 1개.
-- trainer01에게 후기를 다양하게 쌓기 위해 매칭을 추가한다.
-- lesson_content를 고유한 문구로 지정해 후기 연결 시 정확히 찾도록 함.
-- =============================================
INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '초급',
       '헬스',
       '1:1 PT',
       '서울',
       50000,
       100000,
       '[더미후기] 자세 교정 위주로 배우고 싶습니다.',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user02';

INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '중급',
       '헬스',
       '1:1 PT',
       '인천',
       60000,
       120000,
       '[더미후기] 벌크업이 목표입니다.',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user03';

INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '초급',
       '수영',
       '그룹',
       '부산',
       30000,
       60000,
       '[더미후기] 생존 수영을 배우고 싶어요.',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user01';

INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '중급',
       '수영',
       '1:1',
       '부산',
       40000,
       80000,
       '[더미후기] 자유형 교정을 원합니다.',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user03';

-- =============================================
-- 후기 (review)
-- reviewer = 작성 회원, trainer = 받는 트레이너, matching_id = 연결 매칭(UNIQUE)
-- trainer01: 5,4,5,3 / trainer02: 4,5  → 별점 분포가 다양하게 보이도록 구성
-- =============================================

-- [trainer01] user02의 추가 헬스 매칭에 대한 후기 (4점)
INSERT
IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[더미후기] 자세 교정 위주로 배우고 싶습니다.' LIMIT 1),
    (SELECT id FROM members WHERE user_id = 'user02'),
    (SELECT id FROM members WHERE user_id = 'trainer01'),
    4, '친절하시고 운동 효과도 좋았습니다. 다만 시간이 조금 짧게 느껴졌어요.', NOW() - INTERVAL 8 DAY, NOW() - INTERVAL 8 DAY;

-- [trainer01] user03의 추가 헬스(벌크업) 매칭에 대한 후기 (5점)
INSERT
IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[더미후기] 벌크업이 목표입니다.' LIMIT 1),
    (SELECT id FROM members WHERE user_id = 'user03'),
    (SELECT id FROM members WHERE user_id = 'trainer01'),
    5, '벌크업 목표에 맞춰 식단까지 챙겨주셔서 만족스럽습니다.', NOW() - INTERVAL 6 DAY, NOW() - INTERVAL 6 DAY;

-- [trainer01] user03의 기존 헬스 매칭에 대한 후기 (3점)
INSERT
IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '근육량 증가가 목표입니다.' LIMIT 1),
    (SELECT id FROM members WHERE user_id = 'user03'),
    (SELECT id FROM members WHERE user_id = 'trainer01'),
    3, '운동은 좋았지만 예약 변경이 조금 번거로웠습니다.', NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 4 DAY;

-- [trainer02] user02의 기존 수영 매칭에 대한 후기 (4점)
INSERT
IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '수영 기초부터 배우고 싶습니다.' LIMIT 1),
    (SELECT id FROM members WHERE user_id = 'user02'),
    (SELECT id FROM members WHERE user_id = 'trainer02'),
    4, '수영 기초를 차근차근 알려주셔서 좋았어요.', NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY;

-- [trainer02] user01의 추가 수영 매칭에 대한 후기 (5점)
INSERT
IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[더미후기] 생존 수영을 배우고 싶어요.' LIMIT 1),
    (SELECT id FROM members WHERE user_id = 'user01'),
    (SELECT id FROM members WHERE user_id = 'trainer02'),
    5, '겁이 많았는데 안전하게 잘 이끌어주셨습니다. 감사해요!', NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY;

-- =============================================
-- [페이지네이션 테스트용] trainer01 후기 추가
-- trainer01에게 후기를 더 쌓아 페이지가 나뉘도록 함 (size 5 기준 2페이지+)
-- 매칭은 후기 1개당 1개 필요 (matching_id UNIQUE)
-- =============================================

-- 추가 매칭 6개 (user01·user02·user03이 trainer01용으로)
INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '초급',
       '헬스',
       '1:1 PT',
       '서울',
       50000,
       100000,
       '[더미페이지] 식단 관리 병행 희망',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user01';

INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '중급',
       '헬스',
       '1:1 PT',
       '부산',
       50000,
       100000,
       '[더미페이지] 체형 교정 희망',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user02';

INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '고급',
       '헬스',
       '1:1 PT',
       '인천',
       50000,
       100000,
       '[더미페이지] 대회 준비',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user03';

INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '초급',
       '헬스',
       '1:1 PT',
       '서울',
       50000,
       100000,
       '[더미페이지] 운동 습관 만들기',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user01';

INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '중급',
       '헬스',
       '1:1 PT',
       '부산',
       50000,
       100000,
       '[더미페이지] 근지구력 향상',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user02';

INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '초급',
       '헬스',
       '1:1 PT',
       '인천',
       50000,
       100000,
       '[더미페이지] 재활 운동',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user03';

-- 트레이너 프로필 공개 설정 기본값 적용
UPDATE trainer_profiles
SET is_public = true
WHERE is_public IS NULL;

-- 추가 후기 6개 (모두 trainer01에게, 별점 다양하게)
INSERT
IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[더미페이지] 식단 관리 병행 희망' LIMIT 1),
       (SELECT id FROM members WHERE user_id = 'user01'),
       (SELECT id FROM members WHERE user_id = 'trainer01'),
       5, '식단까지 같이 봐주셔서 큰 도움이 됐습니다.', NOW() - INTERVAL 20 DAY, NOW() - INTERVAL 20 DAY;

INSERT
IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[더미페이지] 체형 교정 희망' LIMIT 1),
       (SELECT id FROM members WHERE user_id = 'user02'),
       (SELECT id FROM members WHERE user_id = 'trainer01'),
       4, '체형 교정 효과를 확실히 느꼈어요.', NOW() - INTERVAL 22 DAY, NOW() - INTERVAL 22 DAY;

INSERT
IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[더미페이지] 대회 준비' LIMIT 1),
       (SELECT id FROM members WHERE user_id = 'user03'),
       (SELECT id FROM members WHERE user_id = 'trainer01'),
       5, '대회 준비 디테일까지 챙겨주셔서 입상했습니다!', NOW() - INTERVAL 24 DAY, NOW() - INTERVAL 24 DAY;

INSERT
IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[더미페이지] 운동 습관 만들기' LIMIT 1),
       (SELECT id FROM members WHERE user_id = 'user01'),
       (SELECT id FROM members WHERE user_id = 'trainer01'),
       3, '꾸준히 다니게 도와주셨지만 시간 약속이 가끔 어긋났어요.', NOW() - INTERVAL 26 DAY, NOW() - INTERVAL 26 DAY;

INSERT
IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[더미페이지] 근지구력 향상' LIMIT 1),
       (SELECT id FROM members WHERE user_id = 'user02'),
       (SELECT id FROM members WHERE user_id = 'trainer01'),
       4, '근지구력이 눈에 띄게 좋아졌습니다.', NOW() - INTERVAL 28 DAY, NOW() - INTERVAL 28 DAY;

INSERT
IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
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
INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '초급',
       '수영',
       '1:1',
       '부산',
       40000,
       80000,
       '[더미작성가능] 접영 배우고 싶어요',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user02';

-- 2) 사용자 희망 시간 (matching_preferred_times → 위 매칭 참조)
INSERT
IGNORE INTO matching_preferred_times (matching_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[더미작성가능] 접영 배우고 싶어요' LIMIT 1),
       'MONDAY', '10:00:00', '11:00:00', NOW(), NOW();

-- 3) 트레이너 가능 시간 (trainer_available_times → trainer02 프로필 참조)
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'MONDAY', '09:00:00', '18:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer02';

-- 4) 매칭 결과 (matching_results → 위 매칭/시간/트레이너 연결)
INSERT
IGNORE INTO matching_results (matching_id, preferred_time_id, trainer_available_time_id, trainer_profile_id, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[더미작성가능] 접영 배우고 싶어요' LIMIT 1),
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
INSERT
IGNORE INTO lesson_requests (matching_result_id, member_id, trainer_profile_id, lesson_pass_type, package_count, requested_date, requested_start_time, requested_end_time, message, status, created_at, updated_at)
SELECT (SELECT mr.id
        FROM matching_results mr
        WHERE mr.matching_id = (SELECT id FROM matching_request WHERE lesson_content = '[더미작성가능] 접영 배우고 싶어요' LIMIT 1)
        LIMIT 1),
    (
SELECT id
FROM members
WHERE user_id = 'user02')
    , (
SELECT tp.id
FROM trainer_profiles tp JOIN members m
ON tp.user_id = m.id
WHERE m.user_id = 'trainer02' LIMIT 1)
    , 'ONE_TIME'
    , NULL
    , '2026-06-15'
    , '10:00:00'
    , '11:00:00'
    , '잘 부탁드립니다!'
    , 'ACCEPTED'
    , NOW()
    , NOW();

-- =============================================
-- [인기 트레이너 보강] 신규 트레이너 후기 더미
-- 인기 트레이너는 review만 있으면 집계됨 (매칭 성사 불필요)
-- 평점을 다양하게 + 내용 15자 이상/4점 이상으로 리얼 후기에도 노출되게 구성
-- 대상: trainer15(성민코치/헬스), trainer17(재호코치/크로스핏), trainer16(나연코치/테니스,골프)
-- matching_id UNIQUE 이므로 후기 1개당 매칭 1개 (lesson_content 고유 문구)
-- =============================================

-- ── 매칭 요청 추가 (후기 연결용) ──────────────────────────
INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '초급',
       '헬스',
       '온라인',
       '대전',
       30000,
       60000,
       '[인기더미] 온라인으로 홈트 배우고 싶어요',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user01';

INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '중급',
       '헬스',
       '온라인',
       '대전',
       30000,
       60000,
       '[인기더미] 식단 코칭 받고 싶습니다',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user03';

INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '중급',
       '크로스핏',
       '1:1',
       '부산',
       70000,
       120000,
       '[인기더미] 체력 한계를 넘고 싶어요',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user02';

INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '고급',
       '크로스핏',
       '1:1',
       '부산',
       70000,
       120000,
       '[인기더미] 와드 기록 단축이 목표입니다',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user03';

INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '고급',
       '테니스',
       '1:1',
       '서울',
       100000,
       150000,
       '[인기더미] 대회 준비 레슨 원합니다',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user01';

-- ── 후기 추가 ────────────────────────────────────────────
-- [trainer15 성민코치] 5점
INSERT
IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[인기더미] 온라인으로 홈트 배우고 싶어요' LIMIT 1),
       (SELECT id FROM members WHERE user_id = 'user01'),
       (SELECT id FROM members WHERE user_id = 'trainer15'),
       5, '온라인인데도 자세를 꼼꼼히 봐주셔서 홈트 효과가 확실했어요.', NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY;

-- [trainer15 성민코치] 4점
INSERT
IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[인기더미] 식단 코칭 받고 싶습니다' LIMIT 1),
       (SELECT id FROM members WHERE user_id = 'user03'),
       (SELECT id FROM members WHERE user_id = 'trainer15'),
       4, '식단 피드백이 꼼꼼해서 좋았습니다. 온라인이라 편했어요.', NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 7 DAY;

-- [trainer17 재호코치] 5점
INSERT
IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[인기더미] 체력 한계를 넘고 싶어요' LIMIT 1),
       (SELECT id FROM members WHERE user_id = 'user02'),
       (SELECT id FROM members WHERE user_id = 'trainer17'),
       5, '강도 높은 크로스핏인데 부상 없이 안전하게 이끌어주셨습니다.', NOW() - INTERVAL 9 DAY, NOW() - INTERVAL 9 DAY;

-- [trainer17 재호코치] 5점
INSERT
IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[인기더미] 와드 기록 단축이 목표입니다' LIMIT 1),
       (SELECT id FROM members WHERE user_id = 'user03'),
       (SELECT id FROM members WHERE user_id = 'trainer17'),
       5, '와드 기록이 눈에 띄게 줄었어요. 동기부여까지 최고입니다!', NOW() - INTERVAL 11 DAY, NOW() - INTERVAL 11 DAY;

-- [trainer16 나연코치] 4점
INSERT
IGNORE INTO review (matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
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
INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '초급',
       '헬스',
       '1:1',
       '서울',
       40000,
       80000,
       '[더미작성가능2] 기초 근력 만들고 싶어요',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user01';

-- 2) 사용자 희망 시간
INSERT
IGNORE INTO matching_preferred_times (matching_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[더미작성가능2] 기초 근력 만들고 싶어요' LIMIT 1),
       'TUESDAY', '14:00:00', '15:00:00', NOW(), NOW();

-- 3) 트레이너 가능 시간 (trainer06)
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'TUESDAY', '13:00:00', '20:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer06';

-- 4) 매칭 결과
INSERT
IGNORE INTO matching_results (matching_id, preferred_time_id, trainer_available_time_id, trainer_profile_id, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[더미작성가능2] 기초 근력 만들고 싶어요' LIMIT 1),
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
INSERT
IGNORE INTO lesson_requests (matching_result_id, member_id, trainer_profile_id, lesson_pass_type, package_count, requested_date, requested_start_time, requested_end_time, message, status, created_at, updated_at)
SELECT (SELECT mr.id
        FROM matching_results mr
        WHERE mr.matching_id = (SELECT id FROM matching_request WHERE lesson_content = '[더미작성가능2] 기초 근력 만들고 싶어요' LIMIT 1)
        LIMIT 1),
    (
SELECT id
FROM members
WHERE user_id = 'user01')
    , (
SELECT tp.id
FROM trainer_profiles tp JOIN members m
ON tp.user_id = m.id
WHERE m.user_id = 'trainer06' LIMIT 1)
    , 'ONE_TIME'
    , NULL
    , '2026-06-16'
    , '14:00:00'
    , '15:00:00'
    , '잘 부탁드립니다!'
    , 'ACCEPTED'
    , NOW()
    , NOW();


-- ───────── user03 → trainer11(현우코치) 성사 ─────────
-- 1) 매칭 요청
INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '중급',
       '크로스핏',
       '1:1',
       '인천',
       60000,
       100000,
       '[더미작성가능3] 크로스핏 입문하고 싶어요',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user03';

-- 2) 사용자 희망 시간
INSERT
IGNORE INTO matching_preferred_times (matching_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[더미작성가능3] 크로스핏 입문하고 싶어요' LIMIT 1),
       'WEDNESDAY', '19:00:00', '20:00:00', NOW(), NOW();

-- 3) 트레이너 가능 시간 (trainer11)
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'WEDNESDAY', '18:00:00', '22:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer11';

-- 4) 매칭 결과
INSERT
IGNORE INTO matching_results (matching_id, preferred_time_id, trainer_available_time_id, trainer_profile_id, created_at, updated_at)
SELECT (SELECT id FROM matching_request WHERE lesson_content = '[더미작성가능3] 크로스핏 입문하고 싶어요' LIMIT 1),
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
INSERT
IGNORE INTO lesson_requests (matching_result_id, member_id, trainer_profile_id, lesson_pass_type, package_count, requested_date, requested_start_time, requested_end_time, message, status, created_at, updated_at)
SELECT (SELECT mr.id
        FROM matching_results mr
        WHERE mr.matching_id = (SELECT id FROM matching_request WHERE lesson_content = '[더미작성가능3] 크로스핏 입문하고 싶어요' LIMIT 1)
        LIMIT 1),
    (
SELECT id
FROM members
WHERE user_id = 'user03')
    , (
SELECT tp.id
FROM trainer_profiles tp JOIN members m
ON tp.user_id = m.id
WHERE m.user_id = 'trainer11' LIMIT 1)
    , 'ONE_TIME'
    , NULL
    , '2026-06-17'
    , '19:00:00'
    , '20:00:00'
    , '잘 부탁드립니다!'
    , 'ACCEPTED'
    , NOW()
    , NOW();

-- =============================================
-- [매칭 기능 종합 테스트] trainer03~18 복수 추천 더미
-- 한 요청마다 같은 지역·종목·유형·수준·예산·시간을 만족하는 트레이너 2명 이상 연결
-- lesson_requests 상태를 PENDING / ACCEPTED / REJECTED로 나누어 마이페이지도 함께 테스트
-- ACCEPTED가 현재 프로젝트에서 매칭 성사 상태이며 별도 lesson_schedule 테이블은 없음
-- =============================================

-- =============================================
-- trainer03~18 가능 시간
-- =============================================
-- trainer03: MONDAY, WEDNESDAY, FRIDAY
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'MONDAY', '09:00:00', '18:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer03'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'MONDAY' AND
                                                        at.start_time = '09:00:00' AND at.end_time = '18:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'WEDNESDAY', '10:00:00', '20:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer03'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND
                                                        at.day_of_week = 'WEDNESDAY' AND at.start_time = '10:00:00' AND
                                                        at.end_time = '20:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'FRIDAY', '08:00:00', '19:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer03'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'FRIDAY' AND
                                                        at.start_time = '08:00:00' AND at.end_time = '19:00:00');

-- trainer04: TUESDAY, THURSDAY, SATURDAY
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'TUESDAY', '12:00:00', '20:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer04'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'TUESDAY' AND
                                                        at.start_time = '12:00:00' AND at.end_time = '20:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'THURSDAY', '09:00:00', '20:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer04'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND
                                                        at.day_of_week = 'THURSDAY' AND at.start_time = '09:00:00' AND
                                                        at.end_time = '20:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'SATURDAY', '08:00:00', '18:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer04'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND
                                                        at.day_of_week = 'SATURDAY' AND at.start_time = '08:00:00' AND
                                                        at.end_time = '18:00:00');

-- trainer05: WEDNESDAY, FRIDAY, SUNDAY
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'WEDNESDAY', '16:00:00', '22:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer05'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND
                                                        at.day_of_week = 'WEDNESDAY' AND at.start_time = '16:00:00' AND
                                                        at.end_time = '22:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'FRIDAY', '15:00:00', '21:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer05'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'FRIDAY' AND
                                                        at.start_time = '15:00:00' AND at.end_time = '21:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'SUNDAY', '10:00:00', '20:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer05'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'SUNDAY' AND
                                                        at.start_time = '10:00:00' AND at.end_time = '20:00:00');

-- trainer06: THURSDAY, SATURDAY, MONDAY
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'THURSDAY', '09:00:00', '18:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer06'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND
                                                        at.day_of_week = 'THURSDAY' AND at.start_time = '09:00:00' AND
                                                        at.end_time = '18:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'SATURDAY', '07:00:00', '19:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer06'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND
                                                        at.day_of_week = 'SATURDAY' AND at.start_time = '07:00:00' AND
                                                        at.end_time = '19:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'MONDAY', '08:00:00', '19:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer06'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'MONDAY' AND
                                                        at.start_time = '08:00:00' AND at.end_time = '19:00:00');

-- trainer07: FRIDAY, SUNDAY, TUESDAY
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'FRIDAY', '17:00:00', '22:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer07'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'FRIDAY' AND
                                                        at.start_time = '17:00:00' AND at.end_time = '22:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'SUNDAY', '08:00:00', '18:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer07'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'SUNDAY' AND
                                                        at.start_time = '08:00:00' AND at.end_time = '18:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'TUESDAY', '11:00:00', '20:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer07'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'TUESDAY' AND
                                                        at.start_time = '11:00:00' AND at.end_time = '20:00:00');

-- trainer08: SATURDAY, MONDAY, WEDNESDAY
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'SATURDAY', '09:00:00', '15:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer08'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND
                                                        at.day_of_week = 'SATURDAY' AND at.start_time = '09:00:00' AND
                                                        at.end_time = '15:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'MONDAY', '07:00:00', '18:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer08'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'MONDAY' AND
                                                        at.start_time = '07:00:00' AND at.end_time = '18:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'WEDNESDAY', '11:00:00', '19:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer08'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND
                                                        at.day_of_week = 'WEDNESDAY' AND at.start_time = '11:00:00' AND
                                                        at.end_time = '19:00:00');

-- trainer09: SUNDAY, TUESDAY, THURSDAY
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'SUNDAY', '10:00:00', '18:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer09'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'SUNDAY' AND
                                                        at.start_time = '10:00:00' AND at.end_time = '18:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'TUESDAY', '09:00:00', '19:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer09'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'TUESDAY' AND
                                                        at.start_time = '09:00:00' AND at.end_time = '19:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'THURSDAY', '14:00:00', '22:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer09'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND
                                                        at.day_of_week = 'THURSDAY' AND at.start_time = '14:00:00' AND
                                                        at.end_time = '22:00:00');

-- trainer10: TUESDAY, THURSDAY, SATURDAY
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'TUESDAY', '10:00:00', '19:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer10'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'TUESDAY' AND
                                                        at.start_time = '10:00:00' AND at.end_time = '19:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'THURSDAY', '10:00:00', '20:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer10'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND
                                                        at.day_of_week = 'THURSDAY' AND at.start_time = '10:00:00' AND
                                                        at.end_time = '20:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'SATURDAY', '09:00:00', '18:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer10'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND
                                                        at.day_of_week = 'SATURDAY' AND at.start_time = '09:00:00' AND
                                                        at.end_time = '18:00:00');

-- trainer11: WEDNESDAY, FRIDAY, MONDAY
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'WEDNESDAY', '17:00:00', '22:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer11'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND
                                                        at.day_of_week = 'WEDNESDAY' AND at.start_time = '17:00:00' AND
                                                        at.end_time = '22:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'FRIDAY', '16:00:00', '22:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer11'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'FRIDAY' AND
                                                        at.start_time = '16:00:00' AND at.end_time = '22:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'MONDAY', '10:00:00', '20:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer11'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'MONDAY' AND
                                                        at.start_time = '10:00:00' AND at.end_time = '20:00:00');

-- trainer12: MONDAY, WEDNESDAY, FRIDAY
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'MONDAY', '08:00:00', '20:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer12'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'MONDAY' AND
                                                        at.start_time = '08:00:00' AND at.end_time = '20:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'WEDNESDAY', '07:00:00', '18:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer12'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND
                                                        at.day_of_week = 'WEDNESDAY' AND at.start_time = '07:00:00' AND
                                                        at.end_time = '18:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'FRIDAY', '09:00:00', '20:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer12'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'FRIDAY' AND
                                                        at.start_time = '09:00:00' AND at.end_time = '20:00:00');

-- trainer13: THURSDAY, SATURDAY, SUNDAY
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'THURSDAY', '08:00:00', '19:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer13'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND
                                                        at.day_of_week = 'THURSDAY' AND at.start_time = '08:00:00' AND
                                                        at.end_time = '19:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'SATURDAY', '08:00:00', '17:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer13'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND
                                                        at.day_of_week = 'SATURDAY' AND at.start_time = '08:00:00' AND
                                                        at.end_time = '17:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'SUNDAY', '11:00:00', '20:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer13'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'SUNDAY' AND
                                                        at.start_time = '11:00:00' AND at.end_time = '20:00:00');

-- trainer14: FRIDAY, SUNDAY, TUESDAY
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'FRIDAY', '18:00:00', '22:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer14'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'FRIDAY' AND
                                                        at.start_time = '18:00:00' AND at.end_time = '22:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'SUNDAY', '09:00:00', '19:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer14'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'SUNDAY' AND
                                                        at.start_time = '09:00:00' AND at.end_time = '19:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'TUESDAY', '14:00:00', '21:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer14'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'TUESDAY' AND
                                                        at.start_time = '14:00:00' AND at.end_time = '21:00:00');

-- trainer15: SATURDAY, MONDAY, THURSDAY
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'SATURDAY', '10:00:00', '16:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer15'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND
                                                        at.day_of_week = 'SATURDAY' AND at.start_time = '10:00:00' AND
                                                        at.end_time = '16:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'MONDAY', '07:00:00', '17:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer15'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'MONDAY' AND
                                                        at.start_time = '07:00:00' AND at.end_time = '17:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'THURSDAY', '11:00:00', '20:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer15'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND
                                                        at.day_of_week = 'THURSDAY' AND at.start_time = '11:00:00' AND
                                                        at.end_time = '20:00:00');

-- trainer16: SUNDAY, TUESDAY, FRIDAY
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'SUNDAY', '09:00:00', '19:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer16'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'SUNDAY' AND
                                                        at.start_time = '09:00:00' AND at.end_time = '19:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'TUESDAY', '08:00:00', '18:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer16'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'TUESDAY' AND
                                                        at.start_time = '08:00:00' AND at.end_time = '18:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'FRIDAY', '10:00:00', '20:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer16'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'FRIDAY' AND
                                                        at.start_time = '10:00:00' AND at.end_time = '20:00:00');

-- trainer17: TUESDAY, THURSDAY, SATURDAY
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'TUESDAY', '13:00:00', '21:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer17'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'TUESDAY' AND
                                                        at.start_time = '13:00:00' AND at.end_time = '21:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'THURSDAY', '13:00:00', '21:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer17'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND
                                                        at.day_of_week = 'THURSDAY' AND at.start_time = '13:00:00' AND
                                                        at.end_time = '21:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'SATURDAY', '09:00:00', '19:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer17'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND
                                                        at.day_of_week = 'SATURDAY' AND at.start_time = '09:00:00' AND
                                                        at.end_time = '19:00:00');

-- trainer18: WEDNESDAY, FRIDAY, SUNDAY
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'WEDNESDAY', '17:00:00', '22:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer18'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND
                                                        at.day_of_week = 'WEDNESDAY' AND at.start_time = '17:00:00' AND
                                                        at.end_time = '22:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'FRIDAY', '14:00:00', '21:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer18'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'FRIDAY' AND
                                                        at.start_time = '14:00:00' AND at.end_time = '21:00:00');

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'SUNDAY', '08:00:00', '17:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer18'
  AND NOT EXISTS (SELECT 1
                  FROM trainer_available_times at WHERE at.trainer_profile_id = tp.id AND at.day_of_week = 'SUNDAY' AND
                                                        at.start_time = '08:00:00' AND at.end_time = '17:00:00');

-- =============================================
-- 트레이너 가능 시간 추가 (trainer19~trainer48)
-- =============================================
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'MONDAY', '09:00:00', '18:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer19';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'WEDNESDAY', '14:00:00', '20:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer19';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'TUESDAY', '10:00:00', '19:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer20';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'THURSDAY', '10:00:00', '19:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer20';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'MONDAY', '08:00:00', '17:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer21';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'FRIDAY', '08:00:00', '17:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer21';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'WEDNESDAY', '12:00:00', '21:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer22';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'SATURDAY', '09:00:00', '15:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer22';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'TUESDAY', '09:00:00', '18:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer23';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'THURSDAY', '09:00:00', '18:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer23';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'SATURDAY', '08:00:00', '16:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer24';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'SUNDAY', '08:00:00', '16:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer24';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'MONDAY', '13:00:00', '20:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer25';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'WEDNESDAY', '13:00:00', '20:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer25';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'TUESDAY', '08:00:00', '17:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer26';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'FRIDAY', '08:00:00', '17:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer26';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'MONDAY', '10:00:00', '19:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer27';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'THURSDAY', '10:00:00', '19:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer27';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'WEDNESDAY', '09:00:00', '18:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer28';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'SATURDAY', '07:00:00', '14:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer28';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'TUESDAY', '11:00:00', '20:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer29';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'FRIDAY', '11:00:00', '20:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer29';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'MONDAY', '09:00:00', '17:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer30';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'SATURDAY', '10:00:00', '18:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer30';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'WEDNESDAY', '08:00:00', '16:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer31';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'FRIDAY', '08:00:00', '16:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer31';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'TUESDAY', '13:00:00', '21:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer32';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'SUNDAY', '09:00:00', '17:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer32';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'MONDAY', '11:00:00', '19:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer33';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'THURSDAY', '11:00:00', '19:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer33';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'WEDNESDAY', '10:00:00', '19:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer34';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'SATURDAY', '08:00:00', '15:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer34';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'MONDAY', '09:00:00', '18:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer35';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'THURSDAY', '09:00:00', '18:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer35';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'TUESDAY', '10:00:00', '20:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer36';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'FRIDAY', '10:00:00', '20:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer36';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'WEDNESDAY', '09:00:00', '17:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer37';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'SATURDAY', '09:00:00', '17:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer37';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'MONDAY', '12:00:00', '20:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer38';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'THURSDAY', '12:00:00', '20:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer38';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'TUESDAY', '08:00:00', '16:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer39';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'SUNDAY', '10:00:00', '18:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer39';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'WEDNESDAY', '11:00:00', '20:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer40';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'SATURDAY', '11:00:00', '20:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer40';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'MONDAY', '08:00:00', '17:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer41';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'FRIDAY', '08:00:00', '17:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer41';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'TUESDAY', '09:00:00', '18:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer42';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'THURSDAY', '09:00:00', '18:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer42';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'WEDNESDAY', '10:00:00', '19:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer43';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'SATURDAY', '10:00:00', '17:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer43';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'MONDAY', '13:00:00', '21:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer44';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'THURSDAY', '13:00:00', '21:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer44';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'TUESDAY', '08:00:00', '17:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer45';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'FRIDAY', '08:00:00', '17:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer45';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'WEDNESDAY', '09:00:00', '18:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer46';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'SUNDAY', '09:00:00', '18:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer46';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'MONDAY', '10:00:00', '19:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer47';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'SATURDAY', '08:00:00', '14:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer47';

INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'TUESDAY', '11:00:00', '19:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer48';
INSERT
IGNORE INTO trainer_available_times (trainer_profile_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT tp.id, 'THURSDAY', '11:00:00', '19:00:00', NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
WHERE m.user_id = 'trainer48';

-- =============================================
-- 복수 추천용 매칭 요청 9개
-- =============================================
INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '초급',
       '필라테스',
       '1:1 PT',
       '서울',
       60000,
       90000,
       '[복수추천01] 자세 교정 필라테스를 배우고 싶어요',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user04';

INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '중급',
       '크로스핏',
       '그룹',
       '부산',
       60000,
       100000,
       '[복수추천02] 그룹 크로스핏으로 체력을 높이고 싶어요',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user05';

INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '초급',
       '요가',
       '1:1 PT',
       '인천',
       60000,
       100000,
       '[복수추천03] 허리 부담이 적은 요가를 원해요',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user01';

INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '초급',
       '헬스',
       '1:1 PT',
       '대구',
       40000,
       70000,
       '[복수추천04] 기초 근력 운동을 시작하고 싶어요',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user02';

INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '중급',
       '수영',
       '그룹',
       '광주',
       50000,
       90000,
       '[복수추천05] 수영 지구력과 영법을 개선하고 싶어요',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user03';

INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '중급',
       '테니스',
       '1:1 PT',
       '대전',
       40000,
       110000,
       '[복수추천06] 테니스 스트로크를 교정하고 싶어요',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user04';

INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '중급',
       '골프',
       '1:1 PT',
       '서울',
       100000,
       140000,
       '[복수추천07] 골프 스윙을 안정적으로 만들고 싶어요',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user05';

INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '초급',
       '댄스',
       '그룹',
       '부산',
       40000,
       80000,
       '[복수추천08] 재미있게 댄스 기초를 배우고 싶어요',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user01';

INSERT
IGNORE INTO matching_request (member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,
       '중급',
       '헬스',
       '1:1 PT',
       '인천',
       60000,
       100000,
       '[복수추천09] 근지구력 중심의 헬스 코칭을 원해요',
       NOW(),
       NOW()
FROM members
WHERE user_id = 'user03';

-- 사용자 선호 시간
INSERT
IGNORE INTO matching_preferred_times (matching_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT id, 'MONDAY', '10:00:00', '11:00:00', NOW(), NOW()
FROM matching_request
WHERE lesson_content = '[복수추천01] 자세 교정 필라테스를 배우고 싶어요' LIMIT 1;

INSERT
IGNORE INTO matching_preferred_times (matching_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT id, 'TUESDAY', '14:00:00', '15:00:00', NOW(), NOW()
FROM matching_request
WHERE lesson_content = '[복수추천02] 그룹 크로스핏으로 체력을 높이고 싶어요' LIMIT 1;

INSERT
IGNORE INTO matching_preferred_times (matching_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT id, 'WEDNESDAY', '18:00:00', '19:00:00', NOW(), NOW()
FROM matching_request
WHERE lesson_content = '[복수추천03] 허리 부담이 적은 요가를 원해요' LIMIT 1;

INSERT
IGNORE INTO matching_preferred_times (matching_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT id, 'THURSDAY', '10:00:00', '11:00:00', NOW(), NOW()
FROM matching_request
WHERE lesson_content = '[복수추천04] 기초 근력 운동을 시작하고 싶어요' LIMIT 1;

INSERT
IGNORE INTO matching_preferred_times (matching_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT id, 'FRIDAY', '19:00:00', '20:00:00', NOW(), NOW()
FROM matching_request
WHERE lesson_content = '[복수추천05] 수영 지구력과 영법을 개선하고 싶어요' LIMIT 1;

INSERT
IGNORE INTO matching_preferred_times (matching_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT id, 'SATURDAY', '11:00:00', '12:00:00', NOW(), NOW()
FROM matching_request
WHERE lesson_content = '[복수추천06] 테니스 스트로크를 교정하고 싶어요' LIMIT 1;

INSERT
IGNORE INTO matching_preferred_times (matching_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT id, 'SUNDAY', '13:00:00', '14:00:00', NOW(), NOW()
FROM matching_request
WHERE lesson_content = '[복수추천07] 골프 스윙을 안정적으로 만들고 싶어요' LIMIT 1;

INSERT
IGNORE INTO matching_preferred_times (matching_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT id, 'TUESDAY', '16:00:00', '17:00:00', NOW(), NOW()
FROM matching_request
WHERE lesson_content = '[복수추천08] 재미있게 댄스 기초를 배우고 싶어요' LIMIT 1;

INSERT
IGNORE INTO matching_preferred_times (matching_id, day_of_week, start_time, end_time, created_at, updated_at)
SELECT id, 'WEDNESDAY', '18:00:00', '19:00:00', NOW(), NOW()
FROM matching_request
WHERE lesson_content = '[복수추천09] 근지구력 중심의 헬스 코칭을 원해요' LIMIT 1;

-- =============================================
-- 매칭 결과: 요청마다 트레이너 2명 이상
-- =============================================
INSERT
IGNORE INTO matching_results (
    matching_id, preferred_time_id, trainer_available_time_id, trainer_profile_id,
    ai_rank, ai_reason, created_at, updated_at
)
SELECT mr.id,
       pt.id,
       at.id,
       tp.id,
       CASE WHEN tm.user_id = 'trainer03' THEN 1 ELSE 2 END,
       CONCAT(tm.user_name, ' 트레이너는 서울 지역 필라테스 조건과 월요일 희망 시간을 충족합니다.'),
       NOW(),
       NOW()
FROM matching_request mr
         JOIN matching_preferred_times pt ON pt.matching_id = mr.id
         JOIN members tm ON tm.user_id IN ('trainer03', 'trainer12')
         JOIN trainer_profiles tp ON tp.user_id = tm.id
         JOIN trainer_available_times at
ON at.trainer_profile_id = tp.id
WHERE mr.lesson_content = '[복수추천01] 자세 교정 필라테스를 배우고 싶어요'
  AND at.day_of_week = 'MONDAY'
  AND at.start_time <= pt.start_time
  AND at.end_time >= pt.end_time;

INSERT
IGNORE INTO matching_results (
    matching_id, preferred_time_id, trainer_available_time_id, trainer_profile_id,
    ai_rank, ai_reason, created_at, updated_at
)
SELECT mr.id,
       pt.id,
       at.id,
       tp.id,
       CASE WHEN tm.user_id = 'trainer04' THEN 1 ELSE 2 END,
       CONCAT(tm.user_name, ' 트레이너는 부산 지역 그룹 크로스핏과 화요일 오후 시간에 적합합니다.'),
       NOW(),
       NOW()
FROM matching_request mr
         JOIN matching_preferred_times pt ON pt.matching_id = mr.id
         JOIN members tm ON tm.user_id IN ('trainer04', 'trainer17')
         JOIN trainer_profiles tp ON tp.user_id = tm.id
         JOIN trainer_available_times at
ON at.trainer_profile_id = tp.id
WHERE mr.lesson_content = '[복수추천02] 그룹 크로스핏으로 체력을 높이고 싶어요'
  AND at.day_of_week = 'TUESDAY'
  AND at.start_time <= pt.start_time
  AND at.end_time >= pt.end_time;

INSERT
IGNORE INTO matching_results (
    matching_id, preferred_time_id, trainer_available_time_id, trainer_profile_id,
    ai_rank, ai_reason, created_at, updated_at
)
SELECT mr.id,
       pt.id,
       at.id,
       tp.id,
       CASE WHEN tm.user_id = 'trainer05' THEN 1 ELSE 2 END,
       CONCAT(tm.user_name, ' 트레이너는 인천 지역 요가 수업과 수요일 저녁 시간을 충족합니다.'),
       NOW(),
       NOW()
FROM matching_request mr
         JOIN matching_preferred_times pt ON pt.matching_id = mr.id
         JOIN members tm ON tm.user_id IN ('trainer05', 'trainer18')
         JOIN trainer_profiles tp ON tp.user_id = tm.id
         JOIN trainer_available_times at
ON at.trainer_profile_id = tp.id
WHERE mr.lesson_content = '[복수추천03] 허리 부담이 적은 요가를 원해요'
  AND at.day_of_week = 'WEDNESDAY'
  AND at.start_time <= pt.start_time
  AND at.end_time >= pt.end_time;

INSERT
IGNORE INTO matching_results (
    matching_id, preferred_time_id, trainer_available_time_id, trainer_profile_id,
    ai_rank, ai_reason, created_at, updated_at
)
SELECT mr.id,
       pt.id,
       at.id,
       tp.id,
       CASE WHEN tm.user_id = 'trainer06' THEN 1 ELSE 2 END,
       CONCAT(tm.user_name, ' 트레이너는 대구 지역 초급 헬스와 목요일 오전 일정에 적합합니다.'),
       NOW(),
       NOW()
FROM matching_request mr
         JOIN matching_preferred_times pt ON pt.matching_id = mr.id
         JOIN members tm ON tm.user_id IN ('trainer06', 'trainer13')
         JOIN trainer_profiles tp ON tp.user_id = tm.id
         JOIN trainer_available_times at
ON at.trainer_profile_id = tp.id
WHERE mr.lesson_content = '[복수추천04] 기초 근력 운동을 시작하고 싶어요'
  AND at.day_of_week = 'THURSDAY'
  AND at.start_time <= pt.start_time
  AND at.end_time >= pt.end_time;

INSERT
IGNORE INTO matching_results (
    matching_id, preferred_time_id, trainer_available_time_id, trainer_profile_id,
    ai_rank, ai_reason, created_at, updated_at
)
SELECT mr.id,
       pt.id,
       at.id,
       tp.id,
       CASE WHEN tm.user_id = 'trainer07' THEN 1 ELSE 2 END,
       CONCAT(tm.user_name, ' 트레이너는 광주 지역 중급 수영과 금요일 저녁 시간을 충족합니다.'),
       NOW(),
       NOW()
FROM matching_request mr
         JOIN matching_preferred_times pt ON pt.matching_id = mr.id
         JOIN members tm ON tm.user_id IN ('trainer07', 'trainer14')
         JOIN trainer_profiles tp ON tp.user_id = tm.id
         JOIN trainer_available_times at
ON at.trainer_profile_id = tp.id
WHERE mr.lesson_content = '[복수추천05] 수영 지구력과 영법을 개선하고 싶어요'
  AND at.day_of_week = 'FRIDAY'
  AND at.start_time <= pt.start_time
  AND at.end_time >= pt.end_time;

INSERT
IGNORE INTO matching_results (
    matching_id, preferred_time_id, trainer_available_time_id, trainer_profile_id,
    ai_rank, ai_reason, created_at, updated_at
)
SELECT mr.id,
       pt.id,
       at.id,
       tp.id,
       CASE WHEN tm.user_id = 'trainer08' THEN 1 ELSE 2 END,
       CONCAT(tm.user_name, ' 트레이너는 대전 지역 테니스 조건과 토요일 일정을 충족합니다.'),
       NOW(),
       NOW()
FROM matching_request mr
         JOIN matching_preferred_times pt ON pt.matching_id = mr.id
         JOIN members tm ON tm.user_id IN ('trainer08', 'trainer15')
         JOIN trainer_profiles tp ON tp.user_id = tm.id
         JOIN trainer_available_times at
ON at.trainer_profile_id = tp.id
WHERE mr.lesson_content = '[복수추천06] 테니스 스트로크를 교정하고 싶어요'
  AND at.day_of_week = 'SATURDAY'
  AND at.start_time <= pt.start_time
  AND at.end_time >= pt.end_time;

INSERT
IGNORE INTO matching_results (
    matching_id, preferred_time_id, trainer_available_time_id, trainer_profile_id,
    ai_rank, ai_reason, created_at, updated_at
)
SELECT mr.id,
       pt.id,
       at.id,
       tp.id,
       CASE WHEN tm.user_id = 'trainer09' THEN 1 ELSE 2 END,
       CONCAT(tm.user_name, ' 트레이너는 서울 지역 골프와 일요일 희망 시간에 적합합니다.'),
       NOW(),
       NOW()
FROM matching_request mr
         JOIN matching_preferred_times pt ON pt.matching_id = mr.id
         JOIN members tm ON tm.user_id IN ('trainer09', 'trainer16')
         JOIN trainer_profiles tp ON tp.user_id = tm.id
         JOIN trainer_available_times at
ON at.trainer_profile_id = tp.id
WHERE mr.lesson_content = '[복수추천07] 골프 스윙을 안정적으로 만들고 싶어요'
  AND at.day_of_week = 'SUNDAY'
  AND at.start_time <= pt.start_time
  AND at.end_time >= pt.end_time;

INSERT
IGNORE INTO matching_results (
    matching_id, preferred_time_id, trainer_available_time_id, trainer_profile_id,
    ai_rank, ai_reason, created_at, updated_at
)
SELECT mr.id,
       pt.id,
       at.id,
       tp.id,
       CASE WHEN tm.user_id = 'trainer10' THEN 1 ELSE 2 END,
       CONCAT(tm.user_name, ' 트레이너는 부산 지역 초급 그룹 댄스와 화요일 일정을 충족합니다.'),
       NOW(),
       NOW()
FROM matching_request mr
         JOIN matching_preferred_times pt ON pt.matching_id = mr.id
         JOIN members tm ON tm.user_id IN ('trainer10', 'trainer04')
         JOIN trainer_profiles tp ON tp.user_id = tm.id
         JOIN trainer_available_times at
ON at.trainer_profile_id = tp.id
WHERE mr.lesson_content = '[복수추천08] 재미있게 댄스 기초를 배우고 싶어요'
  AND at.day_of_week = 'TUESDAY'
  AND at.start_time <= pt.start_time
  AND at.end_time >= pt.end_time;

INSERT
IGNORE INTO matching_results (
    matching_id, preferred_time_id, trainer_available_time_id, trainer_profile_id,
    ai_rank, ai_reason, created_at, updated_at
)
SELECT mr.id,
       pt.id,
       at.id,
       tp.id,
       CASE WHEN tm.user_id = 'trainer11' THEN 1 ELSE 2 END,
       CONCAT(tm.user_name, ' 트레이너는 인천 지역 중급 헬스와 수요일 저녁 시간에 적합합니다.'),
       NOW(),
       NOW()
FROM matching_request mr
         JOIN matching_preferred_times pt ON pt.matching_id = mr.id
         JOIN members tm ON tm.user_id IN ('trainer11', 'trainer18')
         JOIN trainer_profiles tp ON tp.user_id = tm.id
         JOIN trainer_available_times at
ON at.trainer_profile_id = tp.id
WHERE mr.lesson_content = '[복수추천09] 근지구력 중심의 헬스 코칭을 원해요'
  AND at.day_of_week = 'WEDNESDAY'
  AND at.start_time = '17:00:00'
  AND at.start_time <= pt.start_time
  AND at.end_time >= pt.end_time;

-- =============================================
-- 레슨 요청: 마이페이지 상태별 미리보기 테스트
-- =============================================
INSERT
IGNORE INTO lesson_requests (
    matching_result_id, member_id, trainer_profile_id, lesson_pass_type, package_count,
    requested_date, requested_start_time, requested_end_time, message, status, created_at, updated_at
)
SELECT mr.id,
       requester.id,
       tp.id,
       'PACKAGE',
       10,
       '2026-06-22',
       '10:00:00',
       '11:00:00',
       '자세 교정과 코어 강화 중심으로 배우고 싶습니다.',
       'PENDING',
       NOW(),
       NOW()
FROM matching_results mr
         JOIN matching_request req ON mr.matching_id = req.id
         JOIN members requester ON req.member_id = requester.id
         JOIN trainer_profiles tp ON mr.trainer_profile_id = tp.id
         JOIN members trainer ON tp.user_id = trainer.id
WHERE req.lesson_content = '[복수추천01] 자세 교정 필라테스를 배우고 싶어요'
  AND trainer.user_id = 'trainer03';

INSERT
IGNORE INTO lesson_requests (
    matching_result_id, member_id, trainer_profile_id, lesson_pass_type, package_count,
    requested_date, requested_start_time, requested_end_time, message, status, created_at, updated_at
)
SELECT mr.id,
       requester.id,
       tp.id,
       'PACKAGE',
       20,
       '2026-06-23',
       '14:00:00',
       '15:00:00',
       '20회 패키지로 꾸준히 체력 향상을 목표로 하고 있습니다.',
       'ACCEPTED',
       NOW(),
       NOW()
FROM matching_results mr
         JOIN matching_request req ON mr.matching_id = req.id
         JOIN members requester ON req.member_id = requester.id
         JOIN trainer_profiles tp ON mr.trainer_profile_id = tp.id
         JOIN members trainer ON tp.user_id = trainer.id
WHERE req.lesson_content = '[복수추천02] 그룹 크로스핏으로 체력을 높이고 싶어요'
  AND trainer.user_id = 'trainer17';

INSERT
IGNORE INTO lesson_requests (
    matching_result_id, member_id, trainer_profile_id, lesson_pass_type, package_count,
    requested_date, requested_start_time, requested_end_time, message, status, created_at, updated_at
)
SELECT mr.id,
       requester.id,
       tp.id,
       'ONE_TIME',
       NULL,
       '2026-06-24',
       '18:00:00',
       '19:00:00',
       '허리에 무리가 가지 않는 동작 위주로 부탁드립니다.',
       'REJECTED',
       NOW(),
       NOW()
FROM matching_results mr
         JOIN matching_request req ON mr.matching_id = req.id
         JOIN members requester ON req.member_id = requester.id
         JOIN trainer_profiles tp ON mr.trainer_profile_id = tp.id
         JOIN members trainer ON tp.user_id = trainer.id
WHERE req.lesson_content = '[복수추천03] 허리 부담이 적은 요가를 원해요'
  AND trainer.user_id = 'trainer05';

INSERT
IGNORE INTO lesson_requests (
    matching_result_id, member_id, trainer_profile_id, lesson_pass_type, package_count,
    requested_date, requested_start_time, requested_end_time, message, status, created_at, updated_at
)
SELECT mr.id,
       requester.id,
       tp.id,
       'ONE_TIME',
       NULL,
       '2026-06-25',
       '10:00:00',
       '11:00:00',
       '헬스가 처음이라 기구 사용법부터 배우고 싶습니다.',
       'ACCEPTED',
       NOW(),
       NOW()
FROM matching_results mr
         JOIN matching_request req ON mr.matching_id = req.id
         JOIN members requester ON req.member_id = requester.id
         JOIN trainer_profiles tp ON mr.trainer_profile_id = tp.id
         JOIN members trainer ON tp.user_id = trainer.id
WHERE req.lesson_content = '[복수추천04] 기초 근력 운동을 시작하고 싶어요'
  AND trainer.user_id = 'trainer06';

INSERT
IGNORE INTO lesson_requests (
    matching_result_id, member_id, trainer_profile_id, lesson_pass_type, package_count,
    requested_date, requested_start_time, requested_end_time, message, status, created_at, updated_at
)
SELECT mr.id,
       requester.id,
       tp.id,
       'PACKAGE',
       10,
       '2026-06-26',
       '19:00:00',
       '20:00:00',
       '자유형 호흡과 장거리 수영 자세를 교정하고 싶습니다.',
       'PENDING',
       NOW(),
       NOW()
FROM matching_results mr
         JOIN matching_request req ON mr.matching_id = req.id
         JOIN members requester ON req.member_id = requester.id
         JOIN trainer_profiles tp ON mr.trainer_profile_id = tp.id
         JOIN members trainer ON tp.user_id = trainer.id
WHERE req.lesson_content = '[복수추천05] 수영 지구력과 영법을 개선하고 싶어요'
  AND trainer.user_id = 'trainer07';

INSERT
IGNORE INTO lesson_requests (
    matching_result_id, member_id, trainer_profile_id, lesson_pass_type, package_count,
    requested_date, requested_start_time, requested_end_time, message, status, created_at, updated_at
)
SELECT mr.id,
       requester.id,
       tp.id,
       'ONE_TIME',
       NULL,
       '2026-06-27',
       '11:00:00',
       '12:00:00',
       '포핸드 스트로크 자세를 집중적으로 교정하고 싶습니다.',
       'PENDING',
       NOW(),
       NOW()
FROM matching_results mr
         JOIN matching_request req ON mr.matching_id = req.id
         JOIN members requester ON req.member_id = requester.id
         JOIN trainer_profiles tp ON mr.trainer_profile_id = tp.id
         JOIN members trainer ON tp.user_id = trainer.id
WHERE req.lesson_content = '[복수추천06] 테니스 스트로크를 교정하고 싶어요'
  AND trainer.user_id = 'trainer08';

INSERT
IGNORE INTO lesson_requests (
    matching_result_id, member_id, trainer_profile_id, lesson_pass_type, package_count,
    requested_date, requested_start_time, requested_end_time, message, status, created_at, updated_at
)
SELECT mr.id,
       requester.id,
       tp.id,
       'PACKAGE',
       5,
       '2026-06-28',
       '13:00:00',
       '14:00:00',
       '라운딩 전 스윙 밸런스와 방향성을 점검하고 싶습니다.',
       'ACCEPTED',
       NOW(),
       NOW()
FROM matching_results mr
         JOIN matching_request req ON mr.matching_id = req.id
         JOIN members requester ON req.member_id = requester.id
         JOIN trainer_profiles tp ON mr.trainer_profile_id = tp.id
         JOIN members trainer ON tp.user_id = trainer.id
WHERE req.lesson_content = '[복수추천07] 골프 스윙을 안정적으로 만들고 싶어요'
  AND trainer.user_id = 'trainer16';

INSERT
IGNORE INTO lesson_requests (
    matching_result_id, member_id, trainer_profile_id, lesson_pass_type, package_count,
    requested_date, requested_start_time, requested_end_time, message, status, created_at, updated_at
)
SELECT mr.id,
       requester.id,
       tp.id,
       'PACKAGE',
       10,
       '2026-06-30',
       '16:00:00',
       '17:00:00',
       '운동을 즐겁게 이어갈 수 있도록 기초부터 부탁드립니다.',
       'PENDING',
       NOW(),
       NOW()
FROM matching_results mr
         JOIN matching_request req ON mr.matching_id = req.id
         JOIN members requester ON req.member_id = requester.id
         JOIN trainer_profiles tp ON mr.trainer_profile_id = tp.id
         JOIN members trainer ON tp.user_id = trainer.id
WHERE req.lesson_content = '[복수추천08] 재미있게 댄스 기초를 배우고 싶어요'
  AND trainer.user_id = 'trainer10';

INSERT
IGNORE INTO lesson_requests (
    matching_result_id, member_id, trainer_profile_id, lesson_pass_type, package_count,
    requested_date, requested_start_time, requested_end_time, message, status, created_at, updated_at
)
SELECT mr.id,
       requester.id,
       tp.id,
       'PACKAGE',
       10,
       '2026-07-01',
       '18:00:00',
       '19:00:00',
       '근지구력을 높이면서 부상 없이 운동하고 싶습니다.',
       'ACCEPTED',
       NOW(),
       NOW()
FROM matching_results mr
         JOIN matching_request req ON mr.matching_id = req.id
         JOIN members requester ON req.member_id = requester.id
         JOIN trainer_profiles tp ON mr.trainer_profile_id = tp.id
         JOIN members trainer ON tp.user_id = trainer.id
WHERE req.lesson_content = '[복수추천09] 근지구력 중심의 헬스 코칭을 원해요'
  AND trainer.user_id = 'trainer11';

-- =============================================
-- 레슨 요청 상태별 알림 더미
-- 실제 서비스에서는 LessonRequestService와 PaymentService가 생성합니다.
-- =============================================

-- PENDING: 요청을 받은 트레이너에게 알림
INSERT INTO alert (receiver_id, type, target_id, content, is_read, created_at, updated_at)
SELECT trainer.id,
       'LESSON_REQUEST',
       lr.id,
       CONCAT(requester.nickname, '님이 레슨을 요청했습니다.'),
       false,
       NOW(),
       NOW()
FROM lesson_requests lr
         JOIN members requester ON lr.member_id = requester.id
         JOIN trainer_profiles tp ON lr.trainer_profile_id = tp.id
         JOIN members trainer ON tp.user_id = trainer.id
WHERE lr.status = 'PENDING'
  AND NOT EXISTS (SELECT 1
                  FROM alert a
                  WHERE a.receiver_id = trainer.id
                    AND a.type = 'LESSON_REQUEST'
                    AND a.target_id = lr.id);

-- ACCEPTED: 요청을 보낸 사용자에게 결제 대기 알림
INSERT INTO alert (receiver_id, type, target_id, content, is_read, created_at, updated_at)
SELECT requester.id,
       'LESSON_REQUEST',
       lr.id,
       CONCAT(trainer.nickname, ' 트레이너가 레슨 요청을 수락했습니다. 결제를 진행해 주세요.'),
       false,
       NOW(),
       NOW()
FROM lesson_requests lr
         JOIN members requester ON lr.member_id = requester.id
         JOIN trainer_profiles tp ON lr.trainer_profile_id = tp.id
         JOIN members trainer ON tp.user_id = trainer.id
WHERE lr.status = 'ACCEPTED'
  AND NOT EXISTS (SELECT 1
                  FROM alert a
                  WHERE a.receiver_id = requester.id
                    AND a.type = 'LESSON_REQUEST'
                    AND a.target_id = lr.id);

-- COMPLETED: 사용자에게 매칭 완료 알림
INSERT INTO alert (receiver_id, type, target_id, content, is_read, created_at, updated_at)
SELECT requester.id,
       'MATCHING_COMPLETED',
       lr.id,
       CONCAT(trainer.nickname, ' 트레이너와의 레슨 매칭이 완료되었습니다.'),
       false,
       NOW(),
       NOW()
FROM lesson_requests lr
         JOIN members requester ON lr.member_id = requester.id
         JOIN trainer_profiles tp ON lr.trainer_profile_id = tp.id
         JOIN members trainer ON tp.user_id = trainer.id
WHERE lr.status = 'COMPLETED'
  AND NOT EXISTS (SELECT 1
                  FROM alert a
                  WHERE a.receiver_id = requester.id
                    AND a.type = 'MATCHING_COMPLETED'
                    AND a.target_id = lr.id);

-- COMPLETED: 트레이너에게 매칭 완료 알림
INSERT INTO alert (receiver_id, type, target_id, content, is_read, created_at, updated_at)
SELECT trainer.id,
       'MATCHING_COMPLETED',
       lr.id,
       CONCAT(requester.nickname, '님과의 레슨 매칭이 완료되었습니다.'),
       false,
       NOW(),
       NOW()
FROM lesson_requests lr
         JOIN members requester ON lr.member_id = requester.id
         JOIN trainer_profiles tp ON lr.trainer_profile_id = tp.id
         JOIN members trainer ON tp.user_id = trainer.id
WHERE lr.status = 'COMPLETED'
  AND NOT EXISTS (SELECT 1
                  FROM alert a
                  WHERE a.receiver_id = trainer.id
                    AND a.type = 'MATCHING_COMPLETED'
                    AND a.target_id = lr.id);

-- =============================================
-- 트레이너 수업 사진 (trainer_lesson_photos)
-- =============================================
INSERT
IGNORE INTO trainer_lesson_photos (trainer_profile_id, image_url, created_at, updated_at)
SELECT tp.id, photo.url, NOW(), NOW()
FROM trainer_profiles tp
         JOIN members m ON tp.user_id = m.id
         JOIN (SELECT 'trainer01' AS user_id, 'https://placehold.co/600x400/fde68a/78350f?text=Lesson+1' AS url
               UNION ALL
               SELECT 'trainer01', 'https://placehold.co/600x400/fde68a/78350f?text=Lesson+2'
               UNION ALL
               SELECT 'trainer01', 'https://placehold.co/600x400/fde68a/78350f?text=Lesson+3'
               UNION ALL
               SELECT 'trainer01', 'https://placehold.co/600x400/fde68a/78350f?text=Lesson+4'
               UNION ALL
               SELECT 'trainer02', 'https://placehold.co/600x400/bfdbfe/1e3a8a?text=Lesson+1'
               UNION ALL
               SELECT 'trainer02', 'https://placehold.co/600x400/bfdbfe/1e3a8a?text=Lesson+2'
               UNION ALL
               SELECT 'trainer02', 'https://placehold.co/600x400/bfdbfe/1e3a8a?text=Lesson+3'
               UNION ALL
               SELECT 'trainer02', 'https://placehold.co/600x400/bfdbfe/1e3a8a?text=Lesson+4'
               UNION ALL
               SELECT 'trainer03', 'https://placehold.co/600x400/fbcfe8/831843?text=Lesson+1'
               UNION ALL
               SELECT 'trainer03', 'https://placehold.co/600x400/fbcfe8/831843?text=Lesson+2'
               UNION ALL
               SELECT 'trainer03', 'https://placehold.co/600x400/fbcfe8/831843?text=Lesson+3'
               UNION ALL
               SELECT 'trainer03', 'https://placehold.co/600x400/fbcfe8/831843?text=Lesson+4'
               UNION ALL
               SELECT 'trainer04', 'https://placehold.co/600x400/bbf7d0/14532d?text=Lesson+1'
               UNION ALL
               SELECT 'trainer04', 'https://placehold.co/600x400/bbf7d0/14532d?text=Lesson+2'
               UNION ALL
               SELECT 'trainer04', 'https://placehold.co/600x400/bbf7d0/14532d?text=Lesson+3'
               UNION ALL
               SELECT 'trainer04', 'https://placehold.co/600x400/bbf7d0/14532d?text=Lesson+4'
               UNION ALL
               SELECT 'trainer05', 'https://placehold.co/600x400/ddd6fe/4c1d95?text=Lesson+1'
               UNION ALL
               SELECT 'trainer05', 'https://placehold.co/600x400/ddd6fe/4c1d95?text=Lesson+2'
               UNION ALL
               SELECT 'trainer05', 'https://placehold.co/600x400/ddd6fe/4c1d95?text=Lesson+3'
               UNION ALL
               SELECT 'trainer05', 'https://placehold.co/600x400/ddd6fe/4c1d95?text=Lesson+4'
               UNION ALL
               SELECT 'trainer06', 'https://placehold.co/600x400/fed7aa/7c2d12?text=Lesson+1'
               UNION ALL
               SELECT 'trainer06', 'https://placehold.co/600x400/fed7aa/7c2d12?text=Lesson+2'
               UNION ALL
               SELECT 'trainer06', 'https://placehold.co/600x400/fed7aa/7c2d12?text=Lesson+3'
               UNION ALL
               SELECT 'trainer06', 'https://placehold.co/600x400/fed7aa/7c2d12?text=Lesson+4'
               UNION ALL
               SELECT 'trainer07', 'https://placehold.co/600x400/a5f3fc/164e63?text=Lesson+1'
               UNION ALL
               SELECT 'trainer07', 'https://placehold.co/600x400/a5f3fc/164e63?text=Lesson+2'
               UNION ALL
               SELECT 'trainer07', 'https://placehold.co/600x400/a5f3fc/164e63?text=Lesson+3'
               UNION ALL
               SELECT 'trainer07', 'https://placehold.co/600x400/a5f3fc/164e63?text=Lesson+4'
               UNION ALL
               SELECT 'trainer08', 'https://placehold.co/600x400/fecaca/7f1d1d?text=Lesson+1'
               UNION ALL
               SELECT 'trainer08', 'https://placehold.co/600x400/fecaca/7f1d1d?text=Lesson+2'
               UNION ALL
               SELECT 'trainer08', 'https://placehold.co/600x400/fecaca/7f1d1d?text=Lesson+3'
               UNION ALL
               SELECT 'trainer08', 'https://placehold.co/600x400/fecaca/7f1d1d?text=Lesson+4'
               UNION ALL
               SELECT 'trainer09', 'https://placehold.co/600x400/fde68a/78350f?text=Lesson+1'
               UNION ALL
               SELECT 'trainer09', 'https://placehold.co/600x400/fde68a/78350f?text=Lesson+2'
               UNION ALL
               SELECT 'trainer09', 'https://placehold.co/600x400/fde68a/78350f?text=Lesson+3'
               UNION ALL
               SELECT 'trainer09', 'https://placehold.co/600x400/fde68a/78350f?text=Lesson+4'
               UNION ALL
               SELECT 'trainer10', 'https://placehold.co/600x400/bfdbfe/1e3a8a?text=Lesson+1'
               UNION ALL
               SELECT 'trainer10', 'https://placehold.co/600x400/bfdbfe/1e3a8a?text=Lesson+2'
               UNION ALL
               SELECT 'trainer10', 'https://placehold.co/600x400/bfdbfe/1e3a8a?text=Lesson+3'
               UNION ALL
               SELECT 'trainer10', 'https://placehold.co/600x400/bfdbfe/1e3a8a?text=Lesson+4'
               UNION ALL
               SELECT 'trainer11', 'https://placehold.co/600x400/fbcfe8/831843?text=Lesson+1'
               UNION ALL
               SELECT 'trainer11', 'https://placehold.co/600x400/fbcfe8/831843?text=Lesson+2'
               UNION ALL
               SELECT 'trainer11', 'https://placehold.co/600x400/fbcfe8/831843?text=Lesson+3'
               UNION ALL
               SELECT 'trainer11', 'https://placehold.co/600x400/fbcfe8/831843?text=Lesson+4'
               UNION ALL
               SELECT 'trainer12', 'https://placehold.co/600x400/bbf7d0/14532d?text=Lesson+1'
               UNION ALL
               SELECT 'trainer12', 'https://placehold.co/600x400/bbf7d0/14532d?text=Lesson+2'
               UNION ALL
               SELECT 'trainer12', 'https://placehold.co/600x400/bbf7d0/14532d?text=Lesson+3'
               UNION ALL
               SELECT 'trainer12', 'https://placehold.co/600x400/bbf7d0/14532d?text=Lesson+4'
               UNION ALL
               SELECT 'trainer13', 'https://placehold.co/600x400/ddd6fe/4c1d95?text=Lesson+1'
               UNION ALL
               SELECT 'trainer13', 'https://placehold.co/600x400/ddd6fe/4c1d95?text=Lesson+2'
               UNION ALL
               SELECT 'trainer13', 'https://placehold.co/600x400/ddd6fe/4c1d95?text=Lesson+3'
               UNION ALL
               SELECT 'trainer13', 'https://placehold.co/600x400/ddd6fe/4c1d95?text=Lesson+4'
               UNION ALL
               SELECT 'trainer14', 'https://placehold.co/600x400/fed7aa/7c2d12?text=Lesson+1'
               UNION ALL
               SELECT 'trainer14', 'https://placehold.co/600x400/fed7aa/7c2d12?text=Lesson+2'
               UNION ALL
               SELECT 'trainer14', 'https://placehold.co/600x400/fed7aa/7c2d12?text=Lesson+3'
               UNION ALL
               SELECT 'trainer14', 'https://placehold.co/600x400/fed7aa/7c2d12?text=Lesson+4'
               UNION ALL
               SELECT 'trainer15', 'https://placehold.co/600x400/a5f3fc/164e63?text=Lesson+1'
               UNION ALL
               SELECT 'trainer15', 'https://placehold.co/600x400/a5f3fc/164e63?text=Lesson+2'
               UNION ALL
               SELECT 'trainer15', 'https://placehold.co/600x400/a5f3fc/164e63?text=Lesson+3'
               UNION ALL
               SELECT 'trainer15', 'https://placehold.co/600x400/a5f3fc/164e63?text=Lesson+4'
               UNION ALL
               SELECT 'trainer16', 'https://placehold.co/600x400/fecaca/7f1d1d?text=Lesson+1'
               UNION ALL
               SELECT 'trainer16', 'https://placehold.co/600x400/fecaca/7f1d1d?text=Lesson+2'
               UNION ALL
               SELECT 'trainer16', 'https://placehold.co/600x400/fecaca/7f1d1d?text=Lesson+3'
               UNION ALL
               SELECT 'trainer16', 'https://placehold.co/600x400/fecaca/7f1d1d?text=Lesson+4'
               UNION ALL
               SELECT 'trainer17', 'https://placehold.co/600x400/fde68a/78350f?text=Lesson+1'
               UNION ALL
               SELECT 'trainer17', 'https://placehold.co/600x400/fde68a/78350f?text=Lesson+2'
               UNION ALL
               SELECT 'trainer17', 'https://placehold.co/600x400/fde68a/78350f?text=Lesson+3'
               UNION ALL
               SELECT 'trainer17', 'https://placehold.co/600x400/fde68a/78350f?text=Lesson+4'
               UNION ALL
               SELECT 'trainer18', 'https://placehold.co/600x400/bfdbfe/1e3a8a?text=Lesson+1'
               UNION ALL
               SELECT 'trainer18', 'https://placehold.co/600x400/bfdbfe/1e3a8a?text=Lesson+2'
               UNION ALL
               SELECT 'trainer18', 'https://placehold.co/600x400/bfdbfe/1e3a8a?text=Lesson+3'
               UNION ALL
               SELECT 'trainer18', 'https://placehold.co/600x400/bfdbfe/1e3a8a?text=Lesson+4') photo
              ON photo.user_id = m.user_id;

-- =============================================
-- 추가 리뷰 더미 데이터
-- trainer03 (필라테스)
-- =============================================

INSERT IGNORE INTO matching_request
(member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,'초급','필라테스','1:1','서울',50000,90000,'[리뷰더미] 허리 통증 개선',NOW(),NOW()
FROM members WHERE user_id='user06';

INSERT IGNORE INTO matching_request
(member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,'초급','필라테스','1:1','서울',50000,90000,'[리뷰더미] 자세 교정 목적',NOW(),NOW()
FROM members WHERE user_id='user07';

INSERT IGNORE INTO matching_request
(member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,'중급','필라테스','1:1','서울',50000,90000,'[리뷰더미] 코어 강화',NOW(),NOW()
FROM members WHERE user_id='user08';


INSERT IGNORE INTO review
(matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT
    (SELECT id FROM matching_request WHERE lesson_content='[리뷰더미] 허리 통증 개선'),
    (SELECT id FROM members WHERE user_id='user06'),
    (SELECT id FROM members WHERE user_id='trainer03'),
    5,
    '허리 통증이 많이 개선되었습니다. 설명도 친절해요.',
    NOW()-INTERVAL 5 DAY,
    NOW()-INTERVAL 5 DAY;

INSERT IGNORE INTO review
(matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT
    (SELECT id FROM matching_request WHERE lesson_content='[리뷰더미] 자세 교정 목적'),
    (SELECT id FROM members WHERE user_id='user07'),
    (SELECT id FROM members WHERE user_id='trainer03'),
    4,
    '체형 교정에 큰 도움이 되었습니다.',
    NOW()-INTERVAL 3 DAY,
    NOW()-INTERVAL 3 DAY;

INSERT IGNORE INTO review
(matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT
    (SELECT id FROM matching_request WHERE lesson_content='[리뷰더미] 코어 강화'),
    (SELECT id FROM members WHERE user_id='user08'),
    (SELECT id FROM members WHERE user_id='trainer03'),
    5,
    '코어 운동 설명이 이해하기 쉬웠습니다.',
    NOW()-INTERVAL 1 DAY,
    NOW()-INTERVAL 1 DAY;


-- =============================================
-- trainer05 (요가)
-- =============================================

INSERT IGNORE INTO matching_request
(member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,'초급','요가','1:1','인천',50000,100000,'[리뷰더미] 유연성 향상',NOW(),NOW()
FROM members WHERE user_id='user09';

INSERT IGNORE INTO matching_request
(member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,'초급','요가','1:1','인천',50000,100000,'[리뷰더미] 스트레스 해소',NOW(),NOW()
FROM members WHERE user_id='user10';

INSERT IGNORE INTO review
(matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT
    (SELECT id FROM matching_request WHERE lesson_content='[리뷰더미] 유연성 향상'),
    (SELECT id FROM members WHERE user_id='user09'),
    (SELECT id FROM members WHERE user_id='trainer05'),
    5,
    '몸이 훨씬 가벼워졌어요.',
    NOW()-INTERVAL 8 DAY,
    NOW()-INTERVAL 8 DAY;

INSERT IGNORE INTO review
(matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT
    (SELECT id FROM matching_request WHERE lesson_content='[리뷰더미] 스트레스 해소'),
    (SELECT id FROM members WHERE user_id='user10'),
    (SELECT id FROM members WHERE user_id='trainer05'),
    5,
    '수업 분위기가 좋아서 스트레스가 풀립니다.',
    NOW()-INTERVAL 2 DAY,
    NOW()-INTERVAL 2 DAY;


-- =============================================
-- trainer08 (테니스)
-- =============================================

INSERT IGNORE INTO matching_request
(member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,'초급','테니스','1:1','대전',80000,150000,'[리뷰더미] 백핸드 교정',NOW(),NOW()
FROM members WHERE user_id='user15';

INSERT IGNORE INTO matching_request
(member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,'중급','테니스','1:1','대전',80000,150000,'[리뷰더미] 서브 향상',NOW(),NOW()
FROM members WHERE user_id='user21';

INSERT IGNORE INTO review
(matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT
    (SELECT id FROM matching_request WHERE lesson_content='[리뷰더미] 백핸드 교정'),
    (SELECT id FROM members WHERE user_id='user15'),
    (SELECT id FROM members WHERE user_id='trainer08'),
    4,
    '백핸드 자세를 쉽게 알려주셨습니다.',
    NOW()-INTERVAL 6 DAY,
    NOW()-INTERVAL 6 DAY;

INSERT IGNORE INTO review
(matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT
    (SELECT id FROM matching_request WHERE lesson_content='[리뷰더미] 서브 향상'),
    (SELECT id FROM members WHERE user_id='user21'),
    (SELECT id FROM members WHERE user_id='trainer08'),
    4,
    '서브 정확도가 좋아졌습니다.',
    NOW()-INTERVAL 4 DAY,
    NOW()-INTERVAL 4 DAY;


-- =============================================
-- trainer11 (헬스)
-- =============================================

INSERT IGNORE INTO matching_request
(member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,'초급','헬스','1:1 PT','인천',50000,100000,'[리뷰더미] 체중 감량',NOW(),NOW()
FROM members WHERE user_id='user17';

INSERT IGNORE INTO matching_request
(member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,'중급','헬스','1:1 PT','인천',50000,100000,'[리뷰더미] 근력 증가',NOW(),NOW()
FROM members WHERE user_id='user23';

INSERT IGNORE INTO review
(matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT
    (SELECT id FROM matching_request WHERE lesson_content='[리뷰더미] 체중 감량'),
    (SELECT id FROM members WHERE user_id='user17'),
    (SELECT id FROM members WHERE user_id='trainer11'),
    5,
    '식단과 운동을 함께 관리해주셔서 만족합니다.',
    NOW()-INTERVAL 7 DAY,
    NOW()-INTERVAL 7 DAY;

INSERT IGNORE INTO review
(matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT
    (SELECT id FROM matching_request WHERE lesson_content='[리뷰더미] 근력 증가'),
    (SELECT id FROM members WHERE user_id='user23'),
    (SELECT id FROM members WHERE user_id='trainer11'),
    4,
    '목표에 맞게 프로그램을 구성해주셨습니다.',
    NOW()-INTERVAL 2 DAY,
    NOW()-INTERVAL 2 DAY;


-- =============================================
-- trainer16 (골프)
-- =============================================

INSERT IGNORE INTO matching_request
(member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,'초급','골프','1:1','서울',100000,150000,'[리뷰더미] 스윙 교정',NOW(),NOW()
FROM members WHERE user_id='user14';

INSERT IGNORE INTO matching_request
(member_id, level, sports, lesson_type, region, budget_min, budget_max, lesson_content, created_at, updated_at)
SELECT id,'중급','골프','1:1','서울',100000,150000,'[리뷰더미] 비거리 향상',NOW(),NOW()
FROM members WHERE user_id='user25';

INSERT IGNORE INTO review
(matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT
    (SELECT id FROM matching_request WHERE lesson_content='[리뷰더미] 스윙 교정'),
    (SELECT id FROM members WHERE user_id='user14'),
    (SELECT id FROM members WHERE user_id='trainer16'),
    5,
    '스윙이 안정적으로 바뀌었습니다.',
    NOW()-INTERVAL 10 DAY,
    NOW()-INTERVAL 10 DAY;

INSERT IGNORE INTO review
(matching_id, reviewer_id, trainer_id, rating, content, created_at, updated_at)
SELECT
    (SELECT id FROM matching_request WHERE lesson_content='[리뷰더미] 비거리 향상'),
    (SELECT id FROM members WHERE user_id='user25'),
    (SELECT id FROM members WHERE user_id='trainer16'),
    5,
    '비거리가 눈에 띄게 늘었습니다.',
    NOW()-INTERVAL 1 DAY,
    NOW()-INTERVAL 1 DAY;