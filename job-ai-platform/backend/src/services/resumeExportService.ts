import PDFDocument from "pdfkit";
import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import type { ResumeTemplateLayout, ResumeTemplateStyle } from "../utils/resumeTemplate";

function sectionHeading(text: string, style: ResumeTemplateStyle): Paragraph {
  const spacingAfter = Math.max(80, style.sectionSpacing * 12);
  const spacingBefore = Math.max(120, style.sectionSpacing * 14);

  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [
      new TextRun({
        text,
        size: style.headingFontSize * 2,
        bold: true
      })
    ],
    spacing: {
      before: spacingBefore,
      after: spacingAfter
    }
  });
}

export class ResumeExportService {
  async generatePDF(layout: ResumeTemplateLayout): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({
        margin: 48,
        size: "A4"
      });
      const chunks: Buffer[] = [];
      const sectionGap = Math.max(0.3, layout.style.sectionSpacing / 18);
      const itemGap = Math.max(0.2, layout.style.sectionSpacing / 35);
      const lineGap = layout.style.lineGap;

      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("error", (error) => reject(error));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      doc.font("Helvetica-Bold").fontSize(22).text(layout.name, { align: "left" });
      if (layout.headline) {
        doc.moveDown(0.2);
        doc.font("Helvetica").fontSize(layout.style.bodyFontSize + 1).text(layout.headline);
      }
      doc.moveDown(sectionGap);

      const writeSectionTitle = (title: string) => {
        doc.font("Helvetica-Bold").fontSize(layout.style.headingFontSize).text(title);
        doc.moveDown(itemGap);
      };

      writeSectionTitle("Summary");
      doc
        .font("Helvetica")
        .fontSize(layout.style.bodyFontSize)
        .text(layout.summary || "No summary provided.", { lineGap });
      doc.moveDown(sectionGap);

      writeSectionTitle("Skills");
      const skillsText = layout.skills.length > 0 ? layout.skills.join(", ") : "No skills provided.";
      doc.font("Helvetica").fontSize(layout.style.bodyFontSize).text(skillsText, { lineGap });
      doc.moveDown(sectionGap);

      writeSectionTitle("Experience");
      if (layout.experience.length === 0) {
        doc
          .font("Helvetica")
          .fontSize(layout.style.bodyFontSize)
          .text("No experience entries provided.", { lineGap });
      } else {
        layout.experience.forEach((item) => {
          doc
            .font("Helvetica-Bold")
            .fontSize(layout.style.bodyFontSize)
            .text(`${item.title || "Role"} | ${item.company || "Company"}`);
          if (item.dates) {
            doc.font("Helvetica-Oblique").fontSize(layout.style.bodyFontSize - 1).text(item.dates);
          }
          item.bullets
            .map((bullet) => bullet.trim())
            .filter(Boolean)
            .forEach((bullet) => {
              doc.font("Helvetica").fontSize(layout.style.bodyFontSize).text(`- ${bullet}`, {
                indent: 10,
                lineGap
              });
            });
          doc.moveDown(itemGap);
        });
      }

      doc.moveDown(itemGap);
      writeSectionTitle("Education");
      if (layout.education.length === 0) {
        doc
          .font("Helvetica")
          .fontSize(layout.style.bodyFontSize)
          .text("No education entries provided.", { lineGap });
      } else {
        layout.education.forEach((item) => {
          doc
            .font("Helvetica-Bold")
            .fontSize(layout.style.bodyFontSize)
            .text(`${item.degree || "Degree"} - ${item.school || "School"}`);
          if (item.dates) {
            doc.font("Helvetica-Oblique").fontSize(layout.style.bodyFontSize - 1).text(item.dates);
          }
          doc.moveDown(itemGap);
        });
      }

      doc.end();
    });
  }

  async generateDOCX(layout: ResumeTemplateLayout): Promise<Buffer> {
    const children: Paragraph[] = [];

    children.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [
          new TextRun({
            text: layout.name,
            bold: true,
            size: 32
          })
        ],
        spacing: {
          after: 80
        }
      })
    );

    if (layout.headline) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: layout.headline,
              size: 24
            })
          ],
          spacing: {
            after: 180
          }
        })
      );
    }

    children.push(sectionHeading("Summary", layout.style));
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: layout.summary || "No summary provided.",
            size: layout.style.bodyFontSize * 2
          })
        ]
      })
    );

    children.push(sectionHeading("Skills", layout.style));
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: layout.skills.length > 0 ? layout.skills.join(", ") : "No skills provided.",
            size: layout.style.bodyFontSize * 2
          })
        ]
      })
    );

    children.push(sectionHeading("Experience", layout.style));
    if (layout.experience.length === 0) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: "No experience entries provided.", size: layout.style.bodyFontSize * 2 })]
        })
      );
    } else {
      layout.experience.forEach((item) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${item.title || "Role"} | ${item.company || "Company"}`,
                bold: true,
                size: layout.style.bodyFontSize * 2
              })
            ],
            spacing: {
              after: 60
            }
          })
        );
        if (item.dates) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: item.dates,
                  italics: true,
                  size: (layout.style.bodyFontSize - 1) * 2
                })
              ],
              spacing: {
                after: 60
              }
            })
          );
        }
        item.bullets
          .map((bullet) => bullet.trim())
          .filter(Boolean)
          .forEach((bullet) => {
            children.push(
              new Paragraph({
                text: bullet,
                bullet: {
                  level: 0
                },
                spacing: {
                  after: 40
                }
              })
            );
          });
      });
    }

    children.push(sectionHeading("Education", layout.style));
    if (layout.education.length === 0) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: "No education entries provided.", size: layout.style.bodyFontSize * 2 })]
        })
      );
    } else {
      layout.education.forEach((item) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${item.degree || "Degree"} - ${item.school || "School"}`,
                bold: true,
                size: layout.style.bodyFontSize * 2
              })
            ],
            spacing: {
              after: 60
            }
          })
        );
        if (item.dates) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: item.dates,
                  italics: true,
                  size: (layout.style.bodyFontSize - 1) * 2
                })
              ],
              spacing: {
                after: 60
              }
            })
          );
        }
      });
    }

    const document = new Document({
      sections: [
        {
          children
        }
      ]
    });

    return Packer.toBuffer(document);
  }
}

export const resumeExportService = new ResumeExportService();
