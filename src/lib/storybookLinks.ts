const STORYBOOK_BASE = 'https://ds.services.gov.ie/storybook-react/?path=/docs/';

const SECTION_MAP: Record<string, string> = {
  Accordion: 'layout',
  Container: 'layout',
  Footer: 'layout',
  Header: 'layout',
  Stack: 'layout',

  Alert: 'application',
  BrowserSupport: 'application',
  CookieBanner: 'application',
  Drawer: 'application',
  Modal: 'application',
  Popover: 'application',
  ProgressStepper: 'application',
  Toast: 'application',
  Tooltip: 'application',

  Autocomplete: 'form',
  ButtonGroup: 'form',
  CharacterCount: 'form',
  ComboBox: 'form',
  FormField: 'form',
  IconButton: 'form',
  Checkbox: 'form',
  InputCheckbox: 'form',
  InputCheckboxGroup: 'form',
  InputFile: 'form',
  InputPassword: 'form',
  InputRadio: 'form',
  InputRadioGroup: 'form',
  Radio: 'form',
  InputText: 'form',
  Select: 'form',
  SelectNext: 'form',
  TextArea: 'form',
  Textarea: 'form',

  Blockquote: 'typography',
  Details: 'typography',
  ErrorText: 'typography',
  HintText: 'typography',
  Label: 'typography',
  List: 'typography',
  ListItem: 'typography',
  Paragraph: 'typography',
  PhaseBanner: 'typography',
  SectionBreak: 'typography',
  Heading: 'typography',
  InsetText: 'typography',
  SummaryList: 'typography',
  Tag: 'typography',

  Breadcrumbs: 'navigation',
  Link: 'navigation',
  Pagination: 'navigation',
  SideNav: 'navigation',
  Tabs: 'navigation',

  Card: 'components',
  Chip: 'components',
  Icon: 'components',
  ScoreSelect: 'components',
  Button: 'components',
  Table: 'components',

  DataTable: 'data-table',
  EditableTableCell: 'data-table',

  ProgressBar: 'indicators',
  Spinner: 'indicators',

  Icons: 'foundation',
  Logos: 'foundation',
};

export function getStorybookUrl(componentName: string): string | null {
  const section = SECTION_MAP[componentName];
  if (!section) return null;
  return `${STORYBOOK_BASE}${section}-${componentName.toLowerCase()}--docs`;
}
