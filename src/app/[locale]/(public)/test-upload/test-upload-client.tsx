"use client";

import { useState } from "react";
import {
  uploadPrivateFile,
  createDownloadUrl,
} from "@/app/[locale]/actions/files";

export default function TestUploadClient() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [s3Key, setS3Key] = useState<string>("");
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Selecciona un archivo primero");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // Subir archivo
      const key = await uploadPrivateFile(file, "ebooks");
      setS3Key(key);

      // Generar URL de descarga
      const url = await createDownloadUrl(key, file.name);
      setDownloadUrl(url);

      console.log("✅ Archivo subido:", key);
      console.log("✅ URL generada:", url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error("Error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">
        🧪 Prueba de carga privada en S3
      </h1>

      <div className="space-y-6">
        {/* Upload Section */}
        <div className="border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">1. Seleccionar un archivo</h2>

          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />

          {file && (
            <p className="text-sm text-gray-600">
              Archivo seleccionado: <strong>{file.name}</strong> (
              {(file.size / 1024).toFixed(2)} KB)
            </p>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploading ? "Subiendo…" : "Subir de forma privada a S3"}
          </button>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {s3Key && (
          <div className="border rounded-lg p-6 space-y-4 bg-green-50">
            <h2 className="text-xl font-semibold text-green-800">
              ✅ Carga completada
            </h2>

            <div>
              <p className="text-sm font-semibold text-gray-700">
                Clave de S3:
              </p>
              <code className="block bg-gray-100 p-2 rounded text-xs break-all">
                {s3Key}
              </code>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700">
                Enlace temporal de descarga (válido durante 2 días):
              </p>
              <code className="block bg-gray-100 p-2 rounded text-xs break-all">
                {downloadUrl}
              </code>
            </div>

            <button
              onClick={handleDownload}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              📥 Descargar archivo
            </button>
          </div>
        )}

        {/* Info Section */}
        <div className="border rounded-lg p-6 bg-blue-50">
          <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Información</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • El archivo se sube al bucket privado (no accesible públicamente)
            </li>
            <li>• Se genera una URL prefirmada válida por 2 días</li>
            <li>• La URL expira automáticamente después de 2 días</li>
            <li>• Solo usuarios autenticados pueden subir archivos</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
