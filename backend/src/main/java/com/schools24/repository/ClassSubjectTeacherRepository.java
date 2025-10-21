package com.schools24.repository;

import com.schools24.domain.ClassSubjectTeacher;
import com.schools24.domain.SchoolClass;
import com.schools24.domain.Subject;
import com.schools24.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClassSubjectTeacherRepository extends JpaRepository<ClassSubjectTeacher, Long> {
    Optional<ClassSubjectTeacher> findBySchoolClassAndSubjectAndTeacher(SchoolClass c, Subject s, User t);
}


