CREATE TABLE IF NOT EXISTS teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    teacher_id VARCHAR(50) UNIQUE NOT NULL,
    subject VARCHAR(100) NOT NULL,
    phone VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON teachers(user_id);
CREATE INDEX IF NOT EXISTS idx_teachers_teacher_id ON teachers(teacher_id);
