import { useState } from "react";
import {
  makeStyles,
  shorthands,
  tokens,
  TabList,
  Tab,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
  MessageBar,
  MessageBarBody,
  MessageBarTitle,
  Badge,
} from "@fluentui/react-components";
import agendaData from './agenda.json'

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalL),
    ...shorthands.padding(tokens.spacingHorizontalL),
  },
  infoSection: {
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalS),
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding(tokens.spacingHorizontalM),
    ...shorthands.borderRadius(tokens.borderRadiusMedium),
  },
  tableContainer: {
    overflowX: "auto", // 保证小屏幕下表格可以横向滚动
  },
  holidayRow: {
    backgroundColor: tokens.colorNeutralBackground1Hover,
    fontStyle: "italic",
    color: tokens.colorNeutralForeground3,
  },
  canceledText: {
    color: tokens.colorPaletteRedForeground1,
    fontWeight: "bold",
  },
  awardsContainer: {
    marginTop: tokens.spacingVerticalL,
    display: "flex",
    flexDirection: "column",
    ...shorthands.gap(tokens.spacingVerticalS),
  },
});

export const AgendaSection = () => {
  const styles = useStyles();
  
  // 默认选中第一个学期
  const [selectedValue, setSelectedValue] = useState(agendaData.semesters[0].id);

  const onTabSelect = (_: any, data: any) => {
    setSelectedValue(data.value);
  };

  // 找到当前选中的学期数据
  const currentSemester = agendaData.semesters.find(
    (s) => s.id === selectedValue
  )!;

  return (
    <div className={styles.container}>
      <Text as="h2" size={600} weight="semibold">
        BioMed Journal Club Agenda
      </Text>

      {/* 学期切换 Tab */}
      <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
        {agendaData.semesters.map((semester) => (
          <Tab key={semester.id} value={semester.id}>
            {semester.title}
          </Tab>
        ))}
      </TabList>

      {/* 基础信息 (时间、地点) */}
      <div className={styles.infoSection}>
        <Text weight="semibold">Location: <Text weight="regular">{currentSemester.location}</Text></Text>
        <Text weight="semibold">Time: <Text weight="regular">{currentSemester.time}</Text></Text>
      </div>

      {/* 日程表格 */}
      <div className={styles.tableContainer}>
        <Table aria-label="Agenda Table">
          <TableHeader>
            <TableRow>
              <TableHeaderCell style={{ width: "100px" }}>Date</TableHeaderCell>
              <TableHeaderCell style={{ width: "250px" }}>Speaker</TableHeaderCell>
              <TableHeaderCell>Presentation Title</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSemester.events.map((event, index) => {
              // 处理假期和取消的情况
              if (event.type === "holiday" || event.type === "canceled") {
                return (
                  <TableRow key={index} className={styles.holidayRow}>
                    <TableCell>{event.date}</TableCell>
                    <TableCell colSpan={2}>
                      <Text className={event.type === "canceled" ? styles.canceledText : ""}>
                        {event.title}
                      </Text>
                    </TableCell>
                  </TableRow>
                );
              }

              // 正常的演讲情况
              return (
                <TableRow key={index}>
                  <TableCell>
                    <Text weight="semibold">{event.date}</Text>
                  </TableCell>
                  <TableCell>
                    <Text block>{event.speaker}</Text>
                    {event.advisor && (
                      <Text size={200} color="neutral-secondary" block>
                        Advisor: {event.advisor}
                      </Text>
                    )}
                  </TableCell>
                  <TableCell>
                    {event.title === "TBD" ? (
                      <Badge appearance="outline" color="warning">TBD</Badge>
                    ) : (
                      event.title
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* 获奖名单展示区 */}
      {currentSemester.awards && (
        <div className={styles.awardsContainer}>
          <MessageBar intent="success" layout="multiline">
            <MessageBarBody>
              <MessageBarTitle>Congratulations to the Best Student Presentation Awardees!</MessageBarTitle>
              <ul style={{ margin: 0, paddingLeft: "20px", marginTop: "8px" }}>
                {currentSemester.awards.map((award, i) => (
                  <li key={i}>
                    <strong>{award.place}:</strong> {award.names}
                  </li>
                ))}
              </ul>
            </MessageBarBody>
          </MessageBar>
        </div>
      )}
    </div>
  );
};