CREATE TABLE IF NOT EXISTS roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);


CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (role_id)
        REFERENCES roles(id)
);


CREATE TABLE IF NOT EXISTS child_profiles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tutor_id BIGINT UNSIGNED NOT NULL,
    nickname VARCHAR(120) NOT NULL,
    age TINYINT UNSIGNED NOT NULL,
    avatar VARCHAR(120),
    support_level ENUM('high', 'medium', 'low') NOT NULL DEFAULT 'high',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (tutor_id)
        REFERENCES users(id),

    CHECK (age BETWEEN 6 AND 10)
);


CREATE TABLE IF NOT EXISTS categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
    description TEXT
);


CREATE TABLE IF NOT EXISTS stories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(180) NOT NULL,
    description TEXT,
    version INT UNSIGNED NOT NULL DEFAULT 1,
    story_order INT UNSIGNED NOT NULL,
    status ENUM('draft', 'published', 'inactive') NOT NULL DEFAULT 'draft',
    estimated_minutes TINYINT UNSIGNED NOT NULL DEFAULT 15,
    initial_scene_id BIGINT UNSIGNED NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id)
        REFERENCES categories(id),

    UNIQUE (story_order)
);


CREATE TABLE IF NOT EXISTS scenes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    story_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(180),
    body TEXT NOT NULL,
    scene_order INT UNSIGNED NOT NULL,
    image_path VARCHAR(255),
    audio_path VARCHAR(255),
    scene_type ENUM(
        'dialogue',
        'preventive_decision',
        'comprehension',
        'final'
    ) NOT NULL DEFAULT 'dialogue',
    is_final BOOLEAN NOT NULL DEFAULT FALSE,

    FOREIGN KEY (story_id)
        REFERENCES stories(id)
        ON DELETE CASCADE,

    UNIQUE (story_id, scene_order)
);


CREATE TABLE IF NOT EXISTS choices (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    scene_id BIGINT UNSIGNED NOT NULL,
    target_scene_id BIGINT UNSIGNED NULL,
    label VARCHAR(220) NOT NULL,
    choice_order INT UNSIGNED NOT NULL DEFAULT 1,
    choice_type ENUM(
        'preventive',
        'comprehension'
    ) NOT NULL DEFAULT 'preventive',
    is_expected_answer BOOLEAN NULL,
    points INT NOT NULL DEFAULT 0,

    FOREIGN KEY (scene_id)
        REFERENCES scenes(id)
        ON DELETE CASCADE,

    FOREIGN KEY (target_scene_id)
        REFERENCES scenes(id)
        ON DELETE SET NULL,

    UNIQUE (scene_id, choice_order)
);


CREATE TABLE IF NOT EXISTS game_sessions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    child_profile_id BIGINT UNSIGNED NOT NULL,
    story_id BIGINT UNSIGNED NOT NULL,
    story_version INT UNSIGNED NOT NULL DEFAULT 1,
    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    status ENUM(
        'in_progress',
        'completed',
        'abandoned'
    ) NOT NULL DEFAULT 'in_progress',

    FOREIGN KEY (child_profile_id)
        REFERENCES child_profiles(id),

    FOREIGN KEY (story_id)
        REFERENCES stories(id)
);


CREATE TABLE IF NOT EXISTS decision_records (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    game_session_id BIGINT UNSIGNED NOT NULL,
    scene_id BIGINT UNSIGNED NOT NULL,
    choice_id BIGINT UNSIGNED NOT NULL,
    selected_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (game_session_id)
        REFERENCES game_sessions(id)
        ON DELETE CASCADE,

    FOREIGN KEY (scene_id)
        REFERENCES scenes(id),

    FOREIGN KEY (choice_id)
        REFERENCES choices(id)
);




CREATE TABLE IF NOT EXISTS scores (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    child_profile_id BIGINT UNSIGNED NOT NULL,
    story_id BIGINT UNSIGNED NOT NULL,
    score INT NOT NULL DEFAULT 0,
    stars TINYINT UNSIGNED NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (child_profile_id)
        REFERENCES child_profiles(id),

    FOREIGN KEY (story_id)
        REFERENCES stories(id),

    UNIQUE (child_profile_id, story_id)
);


CREATE TABLE IF NOT EXISTS achievements (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
    description VARCHAR(255),
    icon_path VARCHAR(255),
    requirement_type VARCHAR(80),
    requirement_value INT UNSIGNED NULL
);


CREATE TABLE IF NOT EXISTS child_achievements (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    child_profile_id BIGINT UNSIGNED NOT NULL,
    achievement_id BIGINT UNSIGNED NOT NULL,
    unlocked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (child_profile_id)
        REFERENCES child_profiles(id)
        ON DELETE CASCADE,

    FOREIGN KEY (achievement_id)
        REFERENCES achievements(id)
        ON DELETE CASCADE,

    UNIQUE (child_profile_id, achievement_id)
);


CREATE TABLE IF NOT EXISTS progress (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    child_profile_id BIGINT UNSIGNED NOT NULL,
    story_id BIGINT UNSIGNED NOT NULL,
    status ENUM(
        'locked',
        'available',
        'in_progress',
        'completed'
    ) NOT NULL DEFAULT 'locked',
    last_scene_id BIGINT UNSIGNED NULL,
    attempts INT UNSIGNED NOT NULL DEFAULT 0,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (child_profile_id)
        REFERENCES child_profiles(id)
        ON DELETE CASCADE,

    FOREIGN KEY (story_id)
        REFERENCES stories(id)
        ON DELETE CASCADE,

    FOREIGN KEY (last_scene_id)
        REFERENCES scenes(id)
        ON DELETE SET NULL,

    UNIQUE (child_profile_id, story_id)
);


