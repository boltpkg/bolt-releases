* allPackages
* packagesToRelease: {pkgName: bumpType}
* allDependents = repo.getDependents(packagesToRelease)
* for dep of allDependents:
  * choices = getChoices(dep, packagesToRelease)

getChoices(dep, packagesToRelease)
* choices = ['patch', 'minor', 'major']
* if p

```
The following dependents would also need to be bumped, is this okay?

* @atlaskit/media-core (patch release)
  * "@atlaskit/button": "~1.0.0" -> "~1.1.0"
```

getPackagesLeavingDepRange(package, packagesToRelease)
* packagesLeavingRange = []
* for each packageToRelease
  * deps = getDepsForPackage(package)
  * for each packagesToRelease
    * mustUpdateOn  = mustUpdateOn(dep)
    * if packageToRelease is in mustUpdateOn
      * packagesLeavingRange.append(packageToRelease)
* return List


getMustUpdateOn(symbol, majorVersion)
* if no symbol
  * return [major, minor, patch] // pinned version, always bump
* if symbol === '^'
  * if major === '0'
    return [major, minor, patch]
  * return major
* if symbol === '~'
  * return [major, minor]



* for pkg of packagesToRelease.keys()
  * dependents = getDependents(pkg)
  *
