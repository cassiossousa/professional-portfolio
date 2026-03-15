import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

import { ResumeData } from './renderResumeData';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },

  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  headline: {
    fontSize: 12,
    marginBottom: 16,
  },

  section: {
    marginTop: 14,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: 'bold',
  },

  role: {
    marginBottom: 10,
  },

  company: {
    fontWeight: 'bold',
  },

  meta: {
    fontSize: 10,
    marginBottom: 4,
  },

  bullet: {
    marginLeft: 10,
    fontSize: 10,
  },
});

interface Props {
  data: ResumeData;
}

export function ResumeDocument({ data }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>Cássio dos Santos Sousa</Text>
        <Text style={styles.headline}>Senior Software Engineer</Text>

        <Text style={styles.section}>Professional Summary</Text>
        <Text>{data.summary}</Text>

        <Text style={styles.section}>Professional Experience</Text>

        {data.roles.map((role, i) => (
          <View key={i} style={styles.role}>
            <Text style={styles.company}>{role.company}</Text>
            <Text>{role.title}</Text>
            <Text style={styles.meta}>
              {role.location ? `${role.location} | ` : ''}
              {role.period}
            </Text>

            {role.bullets.map((b, j) => (
              <Text key={j} style={styles.bullet}>
                • {b}
              </Text>
            ))}
          </View>
        ))}

        <Text style={styles.section}>Languages</Text>

        {data.languages.map((l, i) => (
          <Text key={i}>{l}</Text>
        ))}
      </Page>
    </Document>
  );
}
