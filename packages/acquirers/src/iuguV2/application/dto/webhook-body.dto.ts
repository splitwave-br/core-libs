export class WebhookBodyDTO {
  pix: {
    endToEndId: string;
    txid: string;
    valor: string;
    chave: string;
    horario: string;
  }[];
}
