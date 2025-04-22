package com.timetrackr.repository;

import com.timetrackr.model.TimeEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long> {
    List<TimeEntry> findByUserId(Long userId);
    
    @Query("""
    	       SELECT COALESCE(SUM(t.duration), 0)
    	       FROM TimeEntry t
    	       WHERE t.user.id = :userId
    	         AND t.date      = :date
    	       """)
    	Double sumDurationForUserAndDate(Long userId, LocalDate date);
}