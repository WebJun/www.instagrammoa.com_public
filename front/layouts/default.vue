<template>
  <div class="d-flex flex-column h-100">
    <nav class="navbar navbar-expand-lg navbar-light bg-light rounded" style="background-color: #fff !important; box-shadow: 5px 3px 5px 3px #ddd;">
      <div class="container-xl">
        <a class="navbar-brand" href="#">SplitShire</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample09" aria-controls="navbarsExample09" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon" />
        </button>

        <div id="navbarsExample07XL" class="collapse navbar-collapse">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
              <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Link</a>
            </li>
            <li class="nav-item">
              <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
            </li>
            <li class="nav-item dropdown">
              <a id="dropdown07XL" class="nav-link dropdown-toggle" href="#" data-toggle="dropdown" aria-expanded="false">Dropdown</a>
              <div class="dropdown-menu" aria-labelledby="dropdown07XL">
                <a class="dropdown-item" href="#">Action</a>
                <a class="dropdown-item" href="#">Another action</a>
                <a class="dropdown-item" href="#">Something else here</a>
              </div>
            </li>
          </ul>
          <form class="form-inline my-2 my-md-0">
            <input class="form-control" type="text" placeholder="Search" aria-label="Search">
          </form>
        </div>
      </div>
    </nav>
    <main>
      <nuxt />
    </main>
    <footer class="footer mt-auto py-3">
      <div class="container">
        <span class="text-muted">Place sticky footer content here.</span>
      </div>
    </footer>
  </div>
</template>
