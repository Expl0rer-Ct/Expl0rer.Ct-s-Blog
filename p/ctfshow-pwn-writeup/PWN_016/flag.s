	.file	"flag.c"
	.text
	.section	.rodata
.LC0:
	.string	"ctfshow{"
	.text
	.globl	ctfshow
	.type	ctfshow, @function
ctfshow:
.LFB0:
	.cfi_startproc
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset 6, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register 6
	subq	$32, %rsp
	movq	%rdi, -24(%rbp)
	leaq	.LC0(%rip), %rdi
	movl	$0, %eax
	call	printf@PLT
	movl	$0, -4(%rbp)
	jmp	.L2
.L3:
	movl	-4(%rbp), %eax
	movslq	%eax, %rdx
	movq	-24(%rbp), %rax
	addq	%rdx, %rax
	movzbl	(%rax), %eax
	movzbl	%al, %eax
	movl	%eax, %edi
	call	putchar@PLT
	addl	$1, -4(%rbp)
.L2:
	cmpl	$15, -4(%rbp)
	jle	.L3
	movl	$125, %edi
	call	putchar@PLT
	nop
	leave
	.cfi_def_cfa 7, 8
	ret
	.cfi_endproc
.LFE0:
	.size	ctfshow, .-ctfshow
	.section	.rodata
.LC1:
	.string	"%2hhx"
	.text
	.globl	main
	.type	main, @function
main:
.LFB1:
	.cfi_startproc
	pushq	%rbp
	.cfi_def_cfa_offset 16
	.cfi_offset 6, -16
	movq	%rsp, %rbp
	.cfi_def_cfa_register 6
	subq	$64, %rsp
	movq	%fs:40, %rax
	movq	%rax, -8(%rbp)
	xorl	%eax, %eax
	movabsq	$4122593792332543030, %rax
	movabsq	$3834596513518335287, %rdx
	movq	%rax, -32(%rbp)
	movq	%rdx, -24(%rbp)
	movl	$825635894, -16(%rbp)
	movb	$0, -12(%rbp)
	movl	$0, -52(%rbp)
	jmp	.L5
.L6:
	leaq	-48(%rbp), %rdx
	movl	-52(%rbp), %eax
	cltq
	addq	%rax, %rdx
	movl	-52(%rbp), %eax
	addl	%eax, %eax
	leaq	-32(%rbp), %rcx
	cltq
	addq	%rcx, %rax
	leaq	.LC1(%rip), %rsi
	movq	%rax, %rdi
	movl	$0, %eax
	call	__isoc99_sscanf@PLT
	addl	$1, -52(%rbp)
.L5:
	cmpl	$15, -52(%rbp)
	jle	.L6
	leaq	-48(%rbp), %rax
	movq	%rax, %rdi
	call	ctfshow
	movl	$0, %eax
	movq	-8(%rbp), %rsi
	xorq	%fs:40, %rsi
	je	.L8
	call	__stack_chk_fail@PLT
.L8:
	leave
	.cfi_def_cfa 7, 8
	ret
	.cfi_endproc
.LFE1:
	.size	main, .-main
	.ident	"GCC: (Ubuntu 7.5.0-3ubuntu1~18.04) 7.5.0"
	.section	.note.GNU-stack,"",@progbits
