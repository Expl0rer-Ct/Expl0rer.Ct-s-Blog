section .data
    msg db "Welcome_to_CTFshow_PWN", 0

section .text
    global _start

_start:

; 立即寻址方式
    mov eax, 11         ; 将11赋值给eax
    add eax, 114504     ; eax加上114504
    sub eax, 1          ; eax减去1

; 寄存器寻址方式
    mov ebx, 0x36d      ; 将0x36d赋值给ebx
    mov edx, ebx        ; 将ebx的值赋值给edx

; 直接寻址方式
    mov ecx, msg      ; 将msg的地址赋值给ecx

; 寄存器间接寻址方式
    mov esi, msg        ; 将msg的地址赋值给esi
    mov eax, [esi]      ; 将esi所指向的地址的值赋值给eax

; 寄存器相对寻址方式
    mov ecx, msg        ; 将msg的地址赋值给ecx
    add ecx, 4          ; 将ecx加上4
    mov eax, [ecx]      ; 将ecx所指向的地址的值赋值给eax

; 基址变址寻址方式
    mov ecx, msg        ; 将msg的地址赋值给ecx
    mov edx, 2          ; 将2赋值给edx
    mov eax, [ecx + edx*2]  ; 将ecx+edx*2所指向的地址的值赋值给eax

; 相对基址变址寻址方式
    mov ecx, msg        ; 将msg的地址赋值给ecx
    mov edx, 1          ; 将1赋值给edx
    add ecx, 8          ; 将ecx加上8
    mov eax, [ecx + edx*2 - 6]  ; 将ecx+edx*2-6所指向的地址的值赋值给eax

; 输出字符串
    mov eax, 4          ; 系统调用号4代表输出字符串
    mov ebx, 1          ; 文件描述符1代表标准输出
    mov ecx, msg        ; 要输出的字符串的地址
    mov edx, 22         ; 要输出的字符串的长度
    int 0x80            ; 调用系统调用

; 退出程序
    mov eax, 1          ; 系统调用号1代表退出程序
    xor ebx, ebx        ; 返回值为0
    int 0x80            ; 调用系统调用
