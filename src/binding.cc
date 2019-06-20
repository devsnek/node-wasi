#include <cerrno>
#ifdef _WIN32
#include <io.h>
#else
#include <sys/types.h>
#include <unistd.h>
#endif

#define NAPI_EXPERIMENTAL
#include "node_api.h"

namespace node {
namespace wasi {

napi_value Seek(napi_env env, napi_callback_info info) {
  napi_status status;

  napi_value args[3];
  size_t argc = 3;
  status = napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);
  if (status != napi_ok) {
    return nullptr;
  }

  uint32_t fd;
  status = napi_get_value_uint32(env, args[0], &fd);
  if (status != napi_ok) {
    return nullptr;
  }

  uint64_t offset;
  bool lossless;
  status = napi_get_value_bigint_uint64(env, args[1], &offset, &lossless);
  if (status != napi_ok) {
    return nullptr;
  }

  int whence;
  status = napi_get_value_int32(env, args[2], &whence);
  if (status != napi_ok) {
    return nullptr;
  }

#ifdef _WIN32
  int64_t new_offset = _lseeki64(fd, offset, whence);
#else
  off_t new_offset = lseek(fd, offset, whence);
#endif  // _WIN32

  napi_value result;
  if (new_offset == -1) {
    status = napi_create_int32(env, errno, &result);
  } else {
    status = napi_create_bigint_uint64(env, new_offset, &result);
  }
  if (status != napi_ok) {
    return nullptr;
  }

  return result;
}

napi_value Init(napi_env env, napi_value exports) {
  napi_status status;

  napi_value jseek;
  status = napi_create_function(
      env, "seek", NAPI_AUTO_LENGTH, Seek, nullptr, &jseek);
  if (status != napi_ok) {
    return nullptr;
  }

  status = napi_set_named_property(env, exports, "seek", jseek);
  if (status != napi_ok) {
    return nullptr;
  }

#define V(n) \
  { \
    napi_value result; \
    napi_create_int32(env, n, &result); \
    napi_set_named_property(env, exports, #n, result); \
  }
  V(SEEK_SET);
  V(SEEK_CUR);
  V(SEEK_END);


  return exports;
}

}  // namespace wasi
}  // namespace node

NAPI_MODULE(wasi, node::wasi::Init)
