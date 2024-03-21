import { type ParentComponent } from 'solid-js';

const Spoiler: ParentComponent = (props) => {
  return (
    <span class='transition duration-150 bg-black dark:bg-white text-transparent hover:text-white dark:hover:text-black'>
      {props.children}
    </span>
  );
};

export default Spoiler;
