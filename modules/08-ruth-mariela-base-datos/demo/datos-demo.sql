-- NAVI - Datos demo
-- Módulo 08 - Ruth Mariela
-- Motor: MySQL 8

USE navi_db;

-- Roles
INSERT INTO roles (name, description) VALUES
('tutor', 'Tutor o familiar responsable del niño'),
('teacher', 'Docente que acompaña el proceso educativo'),
('admin', 'Administrador del sistema');

-- Usuarios
INSERT INTO users (role_id, name, email, password, status) VALUES
(1, 'Ana Pérez', 'ana.perez@navi.test', '$2y$10$demo_tutor_1', 'active'),
(2, 'Carlos Rojas', 'carlos.rojas@navi.test', '$2y$10$demo_teacher_1', 'active'),
(3, 'Administrador NAVI', 'admin@navi.test', '$2y$10$demo_admin_1', 'active');

-- Perfiles infantiles
INSERT INTO child_profiles (
    tutor_id,
    nickname,
    age,
    avatar,
    support_level
) VALUES
(1, 'Luna', 8, 'avatar_luna.png', 'medium'),
(1, 'Mateo', 10, 'avatar_mateo.png', 'low');

-- Categorías
INSERT INTO categories (name, description) VALUES
('Seguridad con desconocidos', 'Misiones sobre prevención y decisiones seguras frente a personas desconocidas'),
('Seguridad digital', 'Misiones relacionadas con mensajes, enlaces y riesgos en internet');

-- Historias
INSERT INTO stories (
    category_id,
    title,
    description,
    version,
    story_order,
    status,
    estimated_minutes
) VALUES
(
    1,
    'El desconocido del parque',
    'Misión preventiva sobre cómo actuar frente a una persona desconocida.',
    1,
    1,
    'published',
    15
),
(
    2,
    'El mensaje misterioso',
    'Misión sobre mensajes inesperados y seguridad digital.',
    1,
    2,
    'published',
    15
);

-- Escenas de la historia 1
INSERT INTO scenes (
    story_id,
    title,
    body,
    scene_order,
    scene_type,
    is_final
) VALUES
(1, 'Inicio en el parque', 'Luna está jugando en el parque mientras espera a su tutor.', 1, 'dialogue', FALSE),
(1, 'Aparece un desconocido', 'Una persona desconocida se acerca y le ofrece mostrarle algo interesante.', 2, 'preventive_decision', FALSE),
(1, 'Buscar al tutor', 'Luna decide buscar a su tutor antes de hacer cualquier otra cosa.', 3, 'dialogue', FALSE),
(1, 'Alejarse del lugar', 'Luna se aleja y busca un lugar seguro con adultos conocidos.', 4, 'dialogue', FALSE),
(1, 'Reflexión final', 'La misión termina con una reflexión sobre pedir ayuda a un adulto de confianza.', 5, 'final', TRUE);

-- Escenas de la historia 2
INSERT INTO scenes (
    story_id,
    title,
    body,
    scene_order,
    scene_type,
    is_final
) VALUES
(2, 'Mensaje nuevo', 'Mateo recibe un mensaje de una persona que no conoce.', 1, 'dialogue', FALSE),
(2, 'Enlace desconocido', 'El mensaje contiene un enlace y promete un premio.', 2, 'preventive_decision', FALSE),
(2, 'Pedir ayuda', 'Mateo decide mostrar el mensaje a un adulto de confianza.', 3, 'dialogue', FALSE),
(2, 'Comprensión', '¿Qué debería hacerse cuando llega un enlace de una persona desconocida?', 4, 'comprehension', FALSE),
(2, 'Cierre', 'Mateo aprende que no debe abrir enlaces desconocidos sin consultar a un adulto.', 5, 'final', TRUE);

-- Asignar escena inicial a cada historia
UPDATE stories
SET initial_scene_id = 1
WHERE id = 1;

UPDATE stories
SET initial_scene_id = 6
WHERE id = 2;

-- Opciones historia 1
INSERT INTO choices (
    scene_id,
    target_scene_id,
    label,
    choice_order,
    choice_type,
    is_expected_answer,
    points
) VALUES
(2, 3, 'Buscar a mi tutor antes de ir con esa persona', 1, 'preventive', NULL, 0),
(2, 4, 'Alejarme y acercarme a un lugar seguro', 2, 'preventive', NULL, 0),
(2, 5, 'Aceptar la invitación sin avisar a nadie', 3, 'preventive', NULL, 0);

-- Opciones historia 2
INSERT INTO choices (
    scene_id,
    target_scene_id,
    label,
    choice_order,
    choice_type,
    is_expected_answer,
    points
) VALUES
(7, 8, 'Mostrar el mensaje a un adulto de confianza', 1, 'preventive', NULL, 0),
(7, 10, 'Abrir el enlace inmediatamente', 2, 'preventive', NULL, 0),
(9, 10, 'No abrirlo y pedir ayuda a un adulto', 1, 'comprehension', TRUE, 10),
(9, 10, 'Abrirlo para saber qué contiene', 2, 'comprehension', FALSE, 0);

-- Sesiones demo
INSERT INTO game_sessions (
    child_profile_id,
    story_id,
    story_version,
    started_at,
    completed_at,
    status
) VALUES
(
    1,
    1,
    1,
    '2026-10-05 18:00:00',
    '2026-10-05 18:14:00',
    'completed'
),
(
    2,
    2,
    1,
    '2026-10-05 19:00:00',
    NULL,
    'in_progress'
);

-- Decisiones registradas
INSERT INTO decision_records (
    game_session_id,
    scene_id,
    choice_id,
    selected_at
) VALUES
(
    1,
    2,
    1,
    '2026-10-05 18:07:00'
),
(
    2,
    7,
    4,
    '2026-10-05 19:05:00'
),
(
    2,
    9,
    6,
    '2026-10-05 19:10:00'
);

-- Puntajes
INSERT INTO scores (
    child_profile_id,
    story_id,
    score,
    stars
) VALUES
(1, 1, 0, 1),
(2, 2, 10, 2);

-- Logros disponibles
INSERT INTO achievements (
    name,
    description,
    icon_path,
    requirement_type,
    requirement_value
) VALUES
(
    'Comienza tu aventura',
    'Completar la primera misión de NAVI.',
    'logro_inicio.png',
    'completed_stories',
    1
),
(
    'Buen observador',
    'Completar una actividad de comprensión.',
    'logro_observador.png',
    'comprehension_completed',
    1
);

-- Logros desbloqueados
INSERT INTO child_achievements (
    child_profile_id,
    achievement_id
) VALUES
(1, 1),
(2, 2);

-- Progreso
INSERT INTO progress (
    child_profile_id,
    story_id,
    status,
    last_scene_id,
    attempts,
    started_at,
    completed_at
) VALUES
(
    1,
    1,
    'completed',
    5,
    1,
    '2026-10-05 18:00:00',
    '2026-10-05 18:14:00'
),
(
    1,
    2,
    'available',
    NULL,
    0,
    NULL,
    NULL
),
(
    2,
    1,
    'completed',
    5,
    1,
    '2026-10-04 17:00:00',
    '2026-10-04 17:16:00'
),
(
    2,
    2,
    'in_progress',
    9,
    1,
    '2026-10-05 19:00:00',
    NULL
);