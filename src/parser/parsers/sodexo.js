import * as utils from '../utils';
import moment from 'moment';

export default {
  pattern: /www.sodexo.fi/,
  async parse(url, lang) {
    const days = [];
    const parseWithDate = async date => {
      const feed = await utils.json(utils.formatUrl(url, date));
      for (let day in feed.menus) {
        const timestamp = moment(date).day(day);
        days.push({
          day: timestamp.format('YYYY-MM-DD'),
          courses: feed.menus[day].map(course => ({
            title: lang === 'fi' ? course.title_fi : course.title_en,
            properties: course.properties ? course.properties.split(', ') : []
          }))
        });
      }
    };
    await Promise.all(utils.getWeeks().map(parseWithDate));
    return days;
  }
};
