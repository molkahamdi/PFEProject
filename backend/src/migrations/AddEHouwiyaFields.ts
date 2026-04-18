// ============================================================
//  ✅ [E-HOUWIYA] Migration TypeORM
//  Ajoute les colonnes E-Houwiya à la table customers :

//  - ehouwiya_signed_doc  : Document signé en base64 (TEXT)
//  - ehouwiya_signature_id : ID de signature TunTrust
//  - ehouwiya_signed_at   : Date de signature
//  - is_contract_signed   : Boolean — contrat signé ou non
// ces champs permettent de stocker les données nécessaires pour le processus de signature électronique via E-Houwiya/TunTrust.
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddEHouwiyaFields1234567890123 implements MigrationInterface {
  name = 'AddEHouwiyaFields1234567890123';

  public async up(queryRunner: QueryRunner): Promise<void> {
    

    // ── Document signé base64 ─────────────────────────────
    await queryRunner.addColumn(
      'customers',
      new TableColumn({
        name:      'ehouwiya_signed_doc',
        type:      'text',
        isNullable: true,
        comment:   '[E-HOUWIYA] Document signé en base64 (XAdES)',
      }),
    );

    // ── ID de signature TunTrust ──────────────────────────
    await queryRunner.addColumn(
      'customers',
      new TableColumn({
        name:      'ehouwiya_signature_id',
        type:      'varchar',
        isNullable: true,
        comment:   '[E-HOUWIYA] ID de la signature validée par TunTrust',
      }),
    );

    // ── Date de signature ─────────────────────────────────
    await queryRunner.addColumn(
      'customers',
      new TableColumn({
        name:      'ehouwiya_signed_at',
        type:      'timestamp',
        isNullable: true,
        comment:   '[E-HOUWIYA] Date de signature électronique',
      }),
    );

    // ── Boolean contrat signé ─────────────────────────────
    await queryRunner.addColumn(
      'customers',
      new TableColumn({
        name:         'is_contract_signed',
        type:         'boolean',
        default:      false,
        isNullable:   false,
        comment:      '[E-HOUWIYA] true = contrat signé électroniquement',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('customers', 'is_contract_signed');
    await queryRunner.dropColumn('customers', 'ehouwiya_signed_at');
    await queryRunner.dropColumn('customers', 'ehouwiya_signature_id');
    await queryRunner.dropColumn('customers', 'ehouwiya_signed_doc');

  }
}
