CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('present', 'absent', 'late')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_teacher_id ON attendance(teacher_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
