CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(40) NOT NULL
);

CREATE TABLE child_profiles (
  id BIGINT PRIMARY KEY,
  tutor_id BIGINT NOT NULL,
  name VARCHAR(120) NOT NULL,
  age INT NOT NULL,
  avatar VARCHAR(120),
  FOREIGN KEY (tutor_id) REFERENCES users(id)
);

CREATE TABLE categories (
  id BIGINT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description TEXT
);

CREATE TABLE stories (
  id BIGINT PRIMARY KEY,
  category_id BIGINT NOT NULL,
  title VARCHAR(180) NOT NULL,
  status VARCHAR(40) NOT NULL,
  initial_scene_id BIGINT,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE scenes (
  id BIGINT PRIMARY KEY,
  story_id BIGINT NOT NULL,
  title VARCHAR(180) NOT NULL,
  body TEXT NOT NULL,
  image_path VARCHAR(255),
  audio_path VARCHAR(255),
  is_final BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (story_id) REFERENCES stories(id)
);

CREATE TABLE choices (
  id BIGINT PRIMARY KEY,
  scene_id BIGINT NOT NULL,
  target_scene_id BIGINT,
  label VARCHAR(220) NOT NULL,
  points INT DEFAULT 0,
  feedback TEXT,
  FOREIGN KEY (scene_id) REFERENCES scenes(id),
  FOREIGN KEY (target_scene_id) REFERENCES scenes(id)
);

CREATE TABLE game_sessions (
  id BIGINT PRIMARY KEY,
  child_profile_id BIGINT NOT NULL,
  story_id BIGINT NOT NULL,
  score INT DEFAULT 0,
  stars INT DEFAULT 0,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (child_profile_id) REFERENCES child_profiles(id),
  FOREIGN KEY (story_id) REFERENCES stories(id)
);

CREATE TABLE decision_records (
  id BIGINT PRIMARY KEY,
  game_session_id BIGINT NOT NULL,
  scene_id BIGINT NOT NULL,
  choice_id BIGINT NOT NULL,
  points INT DEFAULT 0,
  FOREIGN KEY (game_session_id) REFERENCES game_sessions(id),
  FOREIGN KEY (scene_id) REFERENCES scenes(id),
  FOREIGN KEY (choice_id) REFERENCES choices(id)
);

