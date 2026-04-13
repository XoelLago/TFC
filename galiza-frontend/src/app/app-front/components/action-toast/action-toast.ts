import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-action-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action-toast.html',
  styleUrls: ['./action-toast.css']
})
export class ActionToastComponent {
  @Input() visible: boolean = false;
  @Input() mensaje: string = '';
  @Input() icon: string = 'priority_high';
  @Input() txtConfirmar: string = 'SÍ, CONTINUAR';
  @Input() txtCancelar: string = 'NO';

  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  onConfirmar() { this.confirmar.emit(); }
  onCancelar() { this.cancelar.emit(); }
}
