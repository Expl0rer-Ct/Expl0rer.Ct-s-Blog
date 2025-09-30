#include <stdio.h>
#include <stdlib.h>

#define BUFFER_SIZE 1024

int main() {
    FILE *fp;
    unsigned char buffer[BUFFER_SIZE];
    size_t n;
    fp = fopen("key", "rb");
    if (fp == NULL) {
        perror("Nothing here!");
        return -1;
    }
    char output[BUFFER_SIZE * 9 + 12]; 
    int offset = 0;
    offset += sprintf(output + offset, "ctfshow{");
    while ((n = fread(buffer, sizeof(unsigned char), BUFFER_SIZE, fp)) > 0) {
        for (size_t i = 0; i < n; i++) {
            for (int j = 7; j >= 0; j--) {
                offset += sprintf(output + offset, "%d", (buffer[i] >> j) & 1);
            }
            if (i != n - 1) {
                offset += sprintf(output + offset, "_");
            }
        }
        if (!feof(fp)) {
            offset += sprintf(output + offset, " ");
        }
    }
    offset += sprintf(output + offset, "}");
    printf("%s\n", output);
    fclose(fp);
    return 0;
}
