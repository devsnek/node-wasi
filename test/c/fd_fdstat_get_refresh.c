#include <unistd.h>
#include <stdlib.h>
#include <assert.h>

int main(void)
{
    isatty(1);
    assert(malloc(65*1024) != NULL);
    isatty(1);
    return 0;
}
