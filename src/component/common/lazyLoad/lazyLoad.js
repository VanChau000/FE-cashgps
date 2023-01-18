import { lazy } from "react";

export function lazyLoad(path, nameExport) {
  return lazy(() => {
    const promise = import(path)
    if (promise == null) {
      return promise
    } else {
      return promise.then(module => ({default: module[nameExport]}))
    }
  })
}

//lazyLoad("/component/abc", "abc")