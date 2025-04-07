package com.timetrackr.service;

import com.timetrackr.model.Invoice;
import com.timetrackr.model.TimeEntry;
import com.timetrackr.repository.InvoiceRepository;
import com.timetrackr.repository.TimeEntryRepository;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;

import java.time.LocalDate;
import java.util.List;

@Service
public class InvoiceService {
    private final InvoiceRepository invoiceRepository;
    private final TimeEntryRepository timeEntryRepository;

    public InvoiceService(InvoiceRepository invoiceRepository, TimeEntryRepository timeEntryRepository) {
        this.invoiceRepository = invoiceRepository;
        this.timeEntryRepository = timeEntryRepository;
    }

    public Invoice createInvoice(Invoice invoice, List<Long> timeEntryIds) {
        List<TimeEntry> entries = timeEntryRepository.findAllById(timeEntryIds);
        double total = entries.stream()
                .map(TimeEntry::getDuration)
                .mapToDouble(Double::doubleValue)
                .sum();
        invoice.setInvoiceDate(LocalDate.now());
        invoice.setTotalAmount(total);
        invoice.setTimeEntries(entries);
        return invoiceRepository.save(invoice);
    }

    public List<Invoice> getInvoicesByUser(Long userId) {
        return invoiceRepository.findByUserId(userId);
    }
}