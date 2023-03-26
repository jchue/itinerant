import styles from './Loader.module.css';

export default function Loader() {
  return (
    <div className="mt-4">
      <div className="mb-2 text-center text-sm">Loading</div>

      <div className={`${styles.raceby} m-auto`}></div>
    </div>
  );
}
