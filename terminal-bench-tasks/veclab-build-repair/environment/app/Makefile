CC      = cc
CFLAGS += -Iinclude -Wall -Wextra -Werror -std=c11
LDLIBS  = -lm

OBJS = src/main.o src/vector.o src/io.o

# Release tuning
CFLAGS = -O2

all: veclab

veclab: $(OBJS)
	$(CC) $(LDLIBS) $(OBJS) -o $@

include/veclab/config.h: config.h.in VERSION
	sed "s/@VERSION@/$$(cat VERSION)/" config.h.in > include/veclab/confg.h

src/main.o: include/veclab/config.h

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f src/*.o veclab include/veclab/config.h

.PHONY: all clean
