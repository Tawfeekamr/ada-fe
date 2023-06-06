import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
/**
 * Custom Tabs component
 */
class MyTabs extends Component {
  constructor() {
    super();
    this.state = { tabIndex: 0 };
  }
  render() {
    const { titles, contents } = this.props;
    return (
      <Tabs
        selectedIndex={this.state.tabIndex}
        onSelect={tabIndex => this.setState({ tabIndex })}
      >
        <TabList>
          {titles.map((title, index) => (
            <Tab key={index}>{title}</Tab>
          ))}
        </TabList>
        <TabList>
          {contents.map((content, index) => (
            <TabPanel key={index}>{content}</TabPanel>
          ))}
        </TabList>
      </Tabs>
    );
  }
}
MyTabs.propTypes = {
  titles: PropTypes.array.isRequired,
  contents: PropTypes.array.isRequired,
};
export default MyTabs;
