package com.timetrackr.controller;

import com.timetrackr.model.Client;
import com.timetrackr.model.Invoice;
import com.timetrackr.model.User;
import com.timetrackr.service.InvoiceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {
    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @PostMapping
    public Invoice create(@RequestBody Map<String, Object> payload) {
        Invoice invoice = new Invoice();
        Long userId = Long.valueOf(payload.get("userId").toString());
        Long clientId = Long.valueOf(payload.get("clientId").toString());

        User user = new User();
        user.setId(userId);
        Client client = new Client();
        client.setId(clientId);

        invoice.setUser(user);
        invoice.setClient(client);

        List<Integer> timeEntryIds = (List<Integer>) payload.get("timeEntryIds");
        List<Long> ids = timeEntryIds.stream().map(Integer::longValue).toList();

        return invoiceService.createInvoice(invoice, ids);
    }

    @GetMapping("/user/{userId}")
    public List<Invoice> getUserInvoices(@PathVariable Long userId) {
        return invoiceService.getInvoicesByUser(userId);
    }
}