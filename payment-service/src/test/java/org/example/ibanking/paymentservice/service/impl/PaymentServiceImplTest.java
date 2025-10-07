//package org.example.ibanking.paymentservice.service.impl;
//
//import org.example.ibanking.paymentservice.client.StudentClient;
//import org.example.ibanking.paymentservice.client.UserClient;
//import org.example.ibanking.paymentservice.dto.PaymentRequest;
//import org.example.ibanking.paymentservice.dto.PaymentResponse;
//import org.example.ibanking.paymentservice.entity.PaymentTransactionEntity;
//import org.example.ibanking.paymentservice.repository.PaymentTransactionRepository;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.*;
//import org.springframework.http.ResponseEntity;
//
//import java.util.UUID;
//
//import static org.assertj.core.api.Assertions.assertThat;
//import static org.junit.jupiter.api.Assertions.assertThrows;
//import static org.mockito.Mockito.*;
//
//@ExtendWith(org.mockito.junit.jupiter.MockitoExtension.class)
//class PaymentServiceImplTest {
//
//    @InjectMocks
//    private PaymentServiceImpl paymentService;
//
//    @Mock
//    private UserClient userClient;
//
//    @Mock
//    private StudentClient studentClient;
//
//    @Mock
//    private PaymentTransactionRepository paymentTransactionRepository;
//
//    private UUID payerId;
//
//    @BeforeEach
//    void setUp() {
//        payerId = UUID.randomUUID();
//    }
//
//    private PaymentRequest buildRequest() {
//        PaymentRequest r = new PaymentRequest();
//        r.setPayerid(payerId);      // UUID
//        r.setStudentid(2L);         // Long
//        r.setTuitionid(100L);       // Long
//        r.setAmount(500.0);
//        return r;
//    }
//
//    // ---------- 1) deduct fails -> save FAILED: DEDUCT ----------
//    @Test
//    void whenDeductFails_shouldSaveFailedDeductTransaction() {
//        PaymentRequest req = buildRequest();
//
//        when(studentClient.status(req.getTuitionid())).thenReturn(ResponseEntity.ok("UNPAID"));
//        doThrow(new RuntimeException("deduct error")).when(userClient).deduct(req.getPayerid(), req.getAmount());
//
//        // capture saved entity
//        ArgumentCaptor<PaymentTransactionEntity> captor = ArgumentCaptor.forClass(PaymentTransactionEntity.class);
//        when(paymentTransactionRepository.save(any(PaymentTransactionEntity.class)))
//                .thenAnswer(invocation -> invocation.getArgument(0));
//
//        RuntimeException ex = assertThrows(RuntimeException.class, () -> paymentService.payTuititon(req));
//        assertThat(ex.getMessage()).contains("Failed to deduct");
//
//        verify(userClient, times(1)).deduct(req.getPayerid(), req.getAmount());
//        verify(userClient, never()).refund(any(), anyDouble());
//        verify(paymentTransactionRepository, times(1)).save(captor.capture());
//
//        PaymentTransactionEntity saved = captor.getValue();
//        assertThat(saved.getStatus()).isEqualTo("FAILED_DEDUCT");
//        assertThat(saved.getPayerid()).isEqualTo(req.getPayerid());
//        assertThat(saved.getAmount()).isEqualTo(req.getAmount());
//    }
//
//    // ---------- 2) deduct ok, markPaid fails -> refund, save FAILED: MARKPAID ----------
//    @Test
//    void whenMarkPaidFails_shouldRefundAndSaveFailedMarkPaidTransaction() {
//        PaymentRequest req = buildRequest();
//
//        // student chưa trả -> cho qua
//        when(studentClient.status(req.getTuitionid()))
//                .thenReturn(ResponseEntity.ok("UNPAID"));
//
//        // giả lập deduct thành công
//        when(userClient.deduct(req.getPayerid(), req.getAmount()))
//                .thenReturn(ResponseEntity.ok("DEDUCTED"));
//
//        // giả lập markPaid bị lỗi
//        when(studentClient.markPaid(req.getStudentid(), req.getTuitionid()))
//                .thenThrow(new RuntimeException("markPaid error"));
//
//        // giả lập refund thành công
//        when(userClient.refund(req.getPayerid(), req.getAmount()))
//                .thenReturn(ResponseEntity.ok("REFUNDED"));
//
//        // capture transaction save
//        ArgumentCaptor<PaymentTransactionEntity> captor = ArgumentCaptor.forClass(PaymentTransactionEntity.class);
//        when(paymentTransactionRepository.save(any(PaymentTransactionEntity.class)))
//                .thenAnswer(inv -> inv.getArgument(0));
//
//        RuntimeException ex = assertThrows(RuntimeException.class,
//                () -> paymentService.payTuititon(req));
//        assertThat(ex.getMessage()).contains("Failed to mark tuition as paid");
//
//        // verify flow thứ tự: deduct -> markPaid -> refund
//        InOrder inOrder = inOrder(userClient, studentClient, userClient);
//        inOrder.verify(userClient).deduct(req.getPayerid(), req.getAmount());
//        inOrder.verify(studentClient).markPaid(req.getStudentid(), req.getTuitionid());
//        inOrder.verify(userClient).refund(req.getPayerid(), req.getAmount());
//
//        // verify transaction được lưu với status FAILED_MARKPAID_REFUNDED
//        verify(paymentTransactionRepository, times(1)).save(captor.capture());
//        PaymentTransactionEntity saved = captor.getValue();
//        assertThat(saved.getStatus()).isEqualTo("FAILED_MARKPAID_REFUNDED");
//        assertThat(saved.getPayerid()).isEqualTo(req.getPayerid());
//    }
//
//
//    // ---------- 3) all success -> save SUCCESS ----------
//    @Test
//    void whenAllSuccess_shouldSaveSuccessTransactionAndReturnResponse() {
//        PaymentRequest req = buildRequest();
//
//        // giả lập student chưa trả
//        when(studentClient.status(req.getTuitionid()))
//                .thenReturn(ResponseEntity.ok("UNPAID"));
//
//        // giả lập deduct và markPaid thành công
//        when(userClient.deduct(req.getPayerid(), req.getAmount()))
//                .thenReturn(ResponseEntity.ok("DEDUCTED"));
//
//        when(studentClient.markPaid(req.getStudentid(), req.getTuitionid()))
//                .thenReturn(ResponseEntity.ok("MARKED_PAID"));
//
//        // capture transaction save
//        when(paymentTransactionRepository.save(any(PaymentTransactionEntity.class)))
//                .thenAnswer(invocation -> {
//                    PaymentTransactionEntity e = invocation.getArgument(0);
//                    e.setId(UUID.randomUUID()); // simulate DB-generated UUID
//                    return e;
//                });
//
//        // call service
//        PaymentResponse resp = paymentService.payTuititon(req);
//
//        // verify response
//        assertThat(resp.getMessage()).isEqualTo("SUCCESS");
//        assertThat(resp.getTransactionId()).isNotNull();
//
//        // verify transaction được lưu đúng
//        ArgumentCaptor<PaymentTransactionEntity> captor = ArgumentCaptor.forClass(PaymentTransactionEntity.class);
//        verify(paymentTransactionRepository, times(1)).save(captor.capture());
//        PaymentTransactionEntity saved = captor.getValue();
//        assertThat(saved.getStatus()).isEqualTo("SUCCESS");
//        assertThat(saved.getPayerid()).isEqualTo(req.getPayerid());
//    }
//
//}
