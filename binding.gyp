{
  'targets': [{
    'target_name': 'wasi',
    'sources': [
      'src/binding.cc',
    ],
    'cflags': [ '-Werror', '-Wall', '-Wextra', '-Wpedantic', '-Wunused-parameter',  '-fno-exceptions' ],
    'cflags_cc': [ '-Werror', '-Wall', '-Wextra', '-Wpedantic', '-Wunused-parameter', '-fno-exceptions' ],
  }],
}
