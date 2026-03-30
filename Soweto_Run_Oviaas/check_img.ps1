Add-Type -AssemblyName System.Drawing
$filePath = 'c:\Users\dagadr\Downloads\Soweto_Run_Oviaas\assets\Oviaas_Coin.png'
if (Test-Path $filePath) {
    try {
        $img = [System.Drawing.Image]::FromFile($filePath)
        Write-Output "Image is valid. Width: $($img.Width), Height: $($img.Height)"
        $img.Dispose()
    } catch {
        Write-Output "Image is corrupted or invalid format: $($_.Exception.Message)"
    }
} else {
    Write-Output "File not found!"
}
