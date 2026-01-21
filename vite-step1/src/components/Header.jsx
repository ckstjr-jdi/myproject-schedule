export default function Header() {
  return (
    <header className="Nav">
      <nav className="Nav_left">
        <a className="Nav_link" href="#">
          Home
        </a>
        <a className="Nav_link" href="#">
          Schedule
        </a>
        <a className="Nav_link" href="#">
          Calendar Search
        </a>
      </nav>

      <div className="Nav_right">
        <button className="Nav_login" type="button">
          로그인
        </button>
      </div>
    </header>
  );
}
