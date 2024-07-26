import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChartUtilsService {
  
  generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  formatCurrency(value: number | undefined): string {
    if (value === undefined) return '0';
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
  }

  addAlpha(color: string, alpha: number): string {
    return `${color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
  }

  lightenColor(color: string, percent: number = 20): string {
    const num = parseInt(color.slice(1), 16);
    const r = (num >> 16) + percent;
    const b = ((num >> 8) & 0x00FF) + percent;
    const g = (num & 0x0000FF) + percent;
    return `#${(0x1000000 + (Math.min(255, r) << 16) + (Math.min(255, b) << 8) + Math.min(255, g)).toString(16).slice(1)}`;
  }

  abreviarNombreEmpresa(nombreEmpresa: string): string {
    const palabras = nombreEmpresa.split(' ');
    const abreviado = palabras.map(palabra => palabra.charAt(0)).join('');
    return abreviado;
  }
}