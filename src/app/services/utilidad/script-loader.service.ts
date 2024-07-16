import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderService {
  private renderer: Renderer2;

  constructor(
    rendererFactory: RendererFactory2,
    private toastr: ToastrService
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  loadAssets(assets: { type: 'script' | 'style', url: string }[]): void {
    // Mostrar un alert cuando se invoque el servicio
    //alert('ScriptLoaderService ha sido invocado para cargar assets.');

    assets.forEach(asset => {
      if (asset.type === 'script') {
        const scriptElement = this.renderer.createElement('script');
        scriptElement.src = asset.url;
        scriptElement.type = 'text/javascript';
        scriptElement.async = true;

        // Añadir manejador de errores
        scriptElement.onerror = () => {
          this.toastr.error(`Error cargando el script: ${asset.url}`, 'Error');
          console.error(`Error cargando el script: ${asset.url}`);
        };

        this.renderer.appendChild(document.body, scriptElement);
      } else if (asset.type === 'style') {
        const linkElement = this.renderer.createElement('link');
        linkElement.href = asset.url;
        linkElement.rel = 'stylesheet';
        linkElement.type = 'text/css';

        // Añadir manejador de errores
        linkElement.onerror = () => {
          this.toastr.error(`Error cargando la hoja de estilo: ${asset.url}`, 'Error');
          console.error(`Error cargando la hoja de estilo: ${asset.url}`);
        };

        this.renderer.appendChild(document.head, linkElement);
      }
    });
  }
}