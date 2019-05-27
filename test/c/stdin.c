// STDIN: hello world
// STDOUT: hello world

#include <stdio.h>

int main(void)
{
    char x[32];

    fgets(x, sizeof x, stdin);
    fputs(x, stdout);
    return 0;
}
