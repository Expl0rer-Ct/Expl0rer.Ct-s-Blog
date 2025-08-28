section .data
    str1 db "CTFshow",0
    str2 db "_3@sy",0
    str3 db "@ss3mb1y",0
    str4 db "_1s",0
    str5 db "ctfshow{"
    str6 db "}"

section .text
    global _start

_start:
    mov eax, 4 
    mov ebx, 1 
    mov ecx, str5 
    mov edx, 8
    int 0x80 

    mov eax, 4
    mov ebx, 1
    mov ecx, str3
    mov edx, 8
    int 0x80

    mov eax, 4
    mov ebx, 1
    mov ecx, str4
    mov edx, 3
    int 0x80

    mov eax, 4
    mov ebx, 1
    mov ecx, str2
    mov edx, 5
    int 0x80

    mov eax, 4
    mov ebx, 1
    mov ecx, str6
    mov edx, 1
    int 0x80

    mov eax, 1 
    xor ebx, ebx 
    int 0x80 
