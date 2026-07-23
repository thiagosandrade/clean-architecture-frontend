param(
    [string]$Environment = "dev",

    [string]$ImageName = "frontend",

    [string]$Tag = "latest"
)


$Config = @{
    dev = @{
        ContainerName = "$Environment-frontend"
        HostPort = 4200
        ApiPort = 5000
    }

    test = @{
        ContainerName = "$Environment-frontend"
        HostPort = 4300
        ApiPort = 6000
    }
}


if (!$Config.ContainsKey($Environment)) {
    Write-Host "Unknown environment: $Environment" -ForegroundColor Red
    exit 1
}


$ContainerName = $Config[$Environment].ContainerName
$HostPort = $Config[$Environment].HostPort


Write-Host ""
Write-Host "===================================" -ForegroundColor Cyan
Write-Host " Building Angular Frontend" -ForegroundColor Cyan
Write-Host " Environment: $Environment" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""


docker build `
    -t "${ImageName}:${Tag}" `
    .


if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker build failed." -ForegroundColor Red
    exit $LASTEXITCODE
}


Write-Host ""
Write-Host "Removing existing container..." -ForegroundColor Yellow

docker rm -f $ContainerName 2>$null


Write-Host ""
Write-Host "Starting container..." -ForegroundColor Yellow


docker run `
    -d `
    --name $ContainerName `
    -p "${HostPort}:80" `
    -e API_PORT=$($Config[$Environment].ApiPort) `
    "${ImageName}:${Tag}"


if ($LASTEXITCODE -eq 0) {

    Write-Host ""
    Write-Host "===================================" -ForegroundColor Green
    Write-Host " Frontend started successfully!" -ForegroundColor Green
    Write-Host "===================================" -ForegroundColor Green
    Write-Host ""

    Write-Host "Environment: $Environment"
    Write-Host "Frontend:    http://localhost:$HostPort"
    Write-Host "Backend API: http://localhost:$($Config[$Environment].ApiPort)"
}