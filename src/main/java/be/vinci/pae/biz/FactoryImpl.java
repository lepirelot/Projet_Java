package be.vinci.pae.biz;

public class FactoryImpl implements Factory {

  @Override
  public MemberDTO getMember() {
    return new MemberImpl();
  }
}
